import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export type Member = {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isVerified: boolean | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
};

export function useMember() {
  const utils = trpc.useUtils();
  
  const { data: member, isLoading, refetch } = trpc.memberAuth.me.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
  
  const requestCodeMutation = trpc.memberAuth.requestCode.useMutation();
  const verifyCodeMutation = trpc.memberAuth.verifyCode.useMutation({
    onSuccess: () => {
      utils.memberAuth.me.invalidate();
    },
  });
  const logoutMutation = trpc.memberAuth.logout.useMutation({
    onSuccess: () => {
      utils.memberAuth.me.invalidate();
    },
  });
  const updateProfileMutation = trpc.memberAuth.updateProfile.useMutation({
    onSuccess: () => {
      utils.memberAuth.me.invalidate();
    },
  });
  
  const requestCode = useCallback(async (email: string) => {
    return requestCodeMutation.mutateAsync({ email });
  }, [requestCodeMutation]);
  
  const verifyCode = useCallback(async (email: string, code: string) => {
    return verifyCodeMutation.mutateAsync({ email, code });
  }, [verifyCodeMutation]);
  
  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);
  
  const updateProfile = useCallback(async (data: { name?: string; bio?: string }) => {
    return updateProfileMutation.mutateAsync(data);
  }, [updateProfileMutation]);
  
  return {
    member: member as Member | null | undefined,
    isLoading,
    isAuthenticated: !!member,
    refetch,
    requestCode,
    verifyCode,
    logout,
    updateProfile,
    isRequestingCode: requestCodeMutation.isPending,
    isVerifyingCode: verifyCodeMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
