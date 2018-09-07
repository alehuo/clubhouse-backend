export interface IPermission {
  permissionId?: number;
  name: string;
  value: number;
  created_at?: Date;
  updated_at?: Date;
}

export const permissionFilter: (perm: IPermission) => IPermission = (
  perm: IPermission
): IPermission => perm;
