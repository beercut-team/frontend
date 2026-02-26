import { UserRole } from '@/shared/api/types';

export const roleLabels: Record<UserRole, string> = {
	[UserRole.ADMIN]: 'Админ',
	[UserRole.SURGEON]: 'Хирург',
	[UserRole.DISTRICT_DOCTOR]: 'Врач',
	[UserRole.PATIENT]: 'Пациент',
};

export const roleLabelsShort: Record<UserRole, string> = {
	[UserRole.ADMIN]: 'Админ',
	[UserRole.SURGEON]: 'Хирург',
	[UserRole.DISTRICT_DOCTOR]: 'Врач',
	[UserRole.PATIENT]: 'Пациент',
};

export function getRoleLabel(role: UserRole, short = false): string {
	return short ? roleLabelsShort[role] : roleLabels[role];
}
