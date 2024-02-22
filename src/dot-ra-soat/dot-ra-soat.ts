export interface IDotRaSoat {
  getAllDotRaSoat(queryParams);
  getDotRaSoatNoQuery();
  getOneDotRaSoat(DotRaSoatID);
  getStatusDotRaSoat();
  updateStatusDotRaSoat(dotRaSoatStatus);
  createTaiLieuTrongDotRaSoat(idDotRaSoat, idTaiLieu);
  createDotRaSoat(dotRaSoat: any);
  editDotRaSoat(dotRaSoat: any);
  deleteOneDotRaSoat(DotRaSoatID: number);
  deleteManyDotRaSoat(DotRaSoatIDs: number[]);
}
