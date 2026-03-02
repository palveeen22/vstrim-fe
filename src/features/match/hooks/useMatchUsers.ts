import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {MatchFilters, MatchService } from '../services/matchService';
import { MatchResponse } from '../model/content';


export const useMatchUsers = (
  userId: string | null,
  filters?: MatchFilters,
  options?: {
    enabled?: boolean;
    refetchOnMount?: boolean;
  }
): UseQueryResult<MatchResponse, Error> => {
  return useQuery({
    queryKey: ['matchUsers', userId, filters],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return MatchService.getMatchedUsers(userId, filters);
    },
    enabled: options?.enabled !== false && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook untuk get specific match score
 */
export const useMatchScore = (userId1: string, userId2: string) => {
  return useQuery({
    queryKey: ['matchScore', userId1, userId2],
    queryFn: () => MatchService.getMatchScore(userId1, userId2),
    enabled: !!userId1 && !!userId2,
    staleTime: 10 * 60 * 1000,
  });
};