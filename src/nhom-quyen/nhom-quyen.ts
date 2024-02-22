export interface INhomQuyen {
  getAllNhomQuyen(search: string);
  getDetailNhomQuyen(idNhomQuyen: number);
  createNhomQuyen(dataNhomQuyen: any);
  updateNhomQuyen(dataNhomQuyenEdit: any);
  deleteOneNhomQuyen(RoleGroupID: number);
  deleteManyNhomQuyen(RoleGroupIDS: number[]);
  copyNhomQuyen(RoleGroupIDS: number[]);
}
