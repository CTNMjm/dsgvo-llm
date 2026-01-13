import { getDb } from "../db";
import { members, loginCodes, memberSessions, Member } from "../../drizzle/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { sendEmail } from "./email";
import crypto from "crypto";

// Generate a 6-digit numeric code
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Request a login code (send via email)
export async function requestLoginCode(email: string, ipAddress?: string): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, message: "Datenbankverbindung nicht verfügbar." };
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check for rate limiting - max 3 codes per hour per email
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCodes = await db
    .select()
    .from(loginCodes)
    .where(
      and(
        eq(loginCodes.email, normalizedEmail),
        gt(loginCodes.createdAt, oneHourAgo)
      )
    );
  
  if (recentCodes.length >= 3) {
    return { success: false, message: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }
  
  // Generate new code
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Store code in database
  await db.insert(loginCodes).values({
    email: normalizedEmail,
    code,
    expiresAt,
    ipAddress,
  });
  
  // Send email with code
  await sendEmail({
    to: normalizedEmail,
    subject: "Ihr Login-Code für LLM-Plattformen Vergleich",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Ihr Login-Code</h2>
        <p>Verwenden Sie den folgenden Code, um sich anzumelden:</p>
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ea580c;">${code}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Dieser Code ist 10 Minuten gültig.<br/>
          Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">
          LLM-Plattformen Vergleich - DSGVO-konforme KI-Lösungen
        </p>
      </div>
    `,
  });
  
  return { success: true, message: "Login-Code wurde an Ihre E-Mail-Adresse gesendet." };
}

// Verify login code and create session
export async function verifyLoginCode(
  email: string, 
  code: string, 
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; token?: string; member?: Member; message: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, message: "Datenbankverbindung nicht verfügbar." };
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // Find valid code
  const [validCode] = await db
    .select()
    .from(loginCodes)
    .where(
      and(
        eq(loginCodes.email, normalizedEmail),
        eq(loginCodes.code, code),
        gt(loginCodes.expiresAt, new Date()),
        isNull(loginCodes.usedAt)
      )
    )
    .limit(1);
  
  if (!validCode) {
    // Check if code exists but is expired or used
    const [existingCode] = await db
      .select()
      .from(loginCodes)
      .where(
        and(
          eq(loginCodes.email, normalizedEmail),
          eq(loginCodes.code, code)
        )
      )
      .limit(1);
    
    if (existingCode) {
      // Increment attempts
      await db
        .update(loginCodes)
        .set({ attempts: (existingCode.attempts || 0) + 1 })
        .where(eq(loginCodes.id, existingCode.id));
      
      if (existingCode.usedAt) {
        return { success: false, message: "Dieser Code wurde bereits verwendet." };
      }
      if (existingCode.expiresAt < new Date()) {
        return { success: false, message: "Dieser Code ist abgelaufen. Bitte fordern Sie einen neuen an." };
      }
    }
    
    return { success: false, message: "Ungültiger Code. Bitte überprüfen Sie Ihre Eingabe." };
  }
  
  // Mark code as used
  await db
    .update(loginCodes)
    .set({ usedAt: new Date() })
    .where(eq(loginCodes.id, validCode.id));
  
  // Find or create member
  let [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, normalizedEmail))
    .limit(1);
  
  if (!member) {
    // Create new member
    const result = await db.insert(members).values({
      email: normalizedEmail,
      isVerified: true,
    }).returning();
    
    member = result[0];
  } else {
    // Update last login
    await db
      .update(members)
      .set({ lastLoginAt: new Date(), isVerified: true })
      .where(eq(members.id, member.id));
  }
  
  // Create session
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  await db.insert(memberSessions).values({
    memberId: member.id,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  });
  
  return { 
    success: true, 
    token, 
    member,
    message: "Erfolgreich angemeldet!" 
  };
}

// Validate session token
export async function validateSession(token: string): Promise<Member | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [session] = await db
    .select()
    .from(memberSessions)
    .where(
      and(
        eq(memberSessions.token, token),
        gt(memberSessions.expiresAt, new Date())
      )
    )
    .limit(1);
  
  if (!session) {
    return null;
  }
  
  // Update last used
  await db
    .update(memberSessions)
    .set({ lastUsedAt: new Date() })
    .where(eq(memberSessions.id, session.id));
  
  // Get member
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, session.memberId))
    .limit(1);
  
  if (!member || !member.isActive) {
    return null;
  }
  
  return member;
}

// Logout (invalidate session)
export async function logout(token: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db
    .delete(memberSessions)
    .where(eq(memberSessions.token, token));
}

// Update member profile
export async function updateMemberProfile(
  memberId: number, 
  data: { name?: string; bio?: string; avatarUrl?: string }
): Promise<Member | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .update(members)
    .set(data)
    .where(eq(members.id, memberId));
  
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, memberId))
    .limit(1);
  
  return member;
}

// Get member by ID
export async function getMemberById(id: number): Promise<Member | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, id))
    .limit(1);
  
  return member || null;
}
