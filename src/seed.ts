import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  BangRoleGroup,
  BangRoleUser,
  BangTenTruongThongTinTVH,
} from './utils/typeorm';

async function seedData(connection: Connection) {
  const defaultTruongTTTV = [
    {
      TruongThongTinID: 1,
      TenTruongTT: 'Thông tin chung',
    },
    {
      TruongThongTinID: 2,
      TenTruongTT: 'Họ và tên',
      TruongThongTinChaID: 1,
    },
    {
      TruongThongTinID: 3,
      TenTruongTT: 'CMND/CCCD',
      TruongThongTinChaID: 1,
    },
    {
      TruongThongTinID: 4,
      TenTruongTT: 'Dân tộc',
      TruongThongTinChaID: 1,
    },
    {
      TruongThongTinID: 5,
      TenTruongTT: 'Ngày sinh',
      TruongThongTinChaID: 1,
    },
    {
      TruongThongTinID: 6,
      TenTruongTT: 'Giới tính',
      TruongThongTinChaID: 1,
    },
    {
      TruongThongTinID: 7,
      TenTruongTT: 'QH với chủ hộ',
    },
    {
      TruongThongTinID: 8,
      TenTruongTT: 'Chủ hộ',
      TruongThongTinChaID: 7,
    },
    {
      TruongThongTinID: 9,
      TenTruongTT: 'Vợ/chồng',
      TruongThongTinChaID: 7,
    },
    {
      TruongThongTinID: 10,
      TenTruongTT: 'Con',
      TruongThongTinChaID: 7,
    },
  ];

  const defaultQuyen = [
    {
      QuyenID: 2,
      TenQuyen: 'Quản Lý Hộ Gia Đình',
    },
    {
      QuyenID: 131,
      QuyenIDCha: 2,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 3,
      QuyenIDCha: 2,
      TenQuyen: 'Thêm hộ gia đình',
    },
    {
      QuyenID: 4,
      QuyenIDCha: 2,
      TenQuyen: 'Thêm hộ gia đình từ file excel',
    },
    {
      QuyenID: 5,
      QuyenIDCha: 2,
      TenQuyen: 'Xóa lựa chọn',
    },
    {
      QuyenID: 127,
      QuyenIDCha: 2,
      TenQuyen: 'Cài đặt thông tin đặc điểm hộ gia đình',
    },
    {
      QuyenID: 128,
      QuyenIDCha: 2,
      TenQuyen: 'Cài đặt thông tin chi tiết thành viên hộ gia đình',
    },
    {
      QuyenID: 6,
      QuyenIDCha: 2,
      TenQuyen: 'Tạo danh sách điều tra rà soát',
    },
    {
      QuyenID: 7,
      QuyenIDCha: 2,
      TenQuyen: 'Sửa hộ gia đình',
    },
    {
      QuyenID: 8,
      QuyenIDCha: 2,
      TenQuyen: 'Xóa hộ gia đình',
    },
    {
      QuyenID: 9,
      TenQuyen: 'Quản Lý Điều Tra Rà Soát',
    },
    {
      QuyenID: 132,
      QuyenIDCha: 9,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 10,
      QuyenIDCha: 9,
      TenQuyen: 'Thêm đợt rà soát',
    },
    {
      QuyenID: 11,
      QuyenIDCha: 9,
      TenQuyen: 'Xóa lựa chọn',
    },
    {
      QuyenID: 12,
      QuyenIDCha: 9,
      TenQuyen: 'Bỏ tất cả lựa chọn',
    },
    {
      QuyenID: 13,
      QuyenIDCha: 9,
      TenQuyen: 'Xem/Sửa chi tiết đợt rà soát',
    },
    {
      QuyenID: 14,
      QuyenIDCha: 9,
      TenQuyen: 'Chỉnh sửa chi tiết đợt rà soát',
    },
    {
      QuyenID: 15,
      QuyenIDCha: 9,
      TenQuyen: 'Xóa đợt rà soát',
    },
    {
      QuyenID: 16,
      TenQuyen: 'Quản Lý Danh Sách Điều Tra Rà Soát',
    },
    {
      QuyenID: 133,
      QuyenIDCha: 16,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 17,
      QuyenIDCha: 16,
      TenQuyen: 'Thêm danh sách điều tra rà soát',
    },
    {
      QuyenID: 18,
      QuyenIDCha: 16,
      TenQuyen: 'Xóa lựa chọn',
    },
    {
      QuyenID: 19,
      QuyenIDCha: 16,
      TenQuyen: 'Bỏ tất cả lựa chọn',
    },
    {
      QuyenID: 20,
      QuyenIDCha: 16,
      TenQuyen: 'Xem/Sửa chi tiết danh sách điều tra rà soát',
    },
    {
      QuyenID: 21,
      QuyenIDCha: 16,
      TenQuyen: 'Xóa danh sách điều tra rà soát',
    },
    {
      QuyenID: 22,
      TenQuyen: 'Quản Lý Báo Cáo',
    },
    {
      QuyenID: 134,
      QuyenIDCha: 22,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 23,
      QuyenIDCha: 22,
      TenQuyen: 'Thêm báo cáo',
    },
    {
      QuyenID: 24,
      QuyenIDCha: 22,
      TenQuyen: 'Xóa báo cáo',
    },
    {
      QuyenID: 25,
      QuyenIDCha: 22,
      TenQuyen: 'Bỏ tất cả lựa chọn',
    },
    {
      QuyenID: 26,
      QuyenIDCha: 22,
      TenQuyen: 'Xem file báo cáo',
    },
    {
      QuyenID: 27,
      QuyenIDCha: 22,
      TenQuyen: 'Chỉnh sửa báo cáo',
    },
    {
      QuyenID: 28,
      QuyenIDCha: 22,
      TenQuyen: 'Xóa báo cáo',
    },
    {
      QuyenID: 129,
      QuyenIDCha: 22,
      TenQuyen: 'Kết xuất báo cáo',
    },
    {
      QuyenID: 130,
      QuyenIDCha: 22,
      TenQuyen: 'Nhập liệu excel',
    },
    {
      QuyenID: 29,
      TenQuyen: 'Tra Cứu Dữ Liệu',
    },
    {
      QuyenID: 135,
      QuyenIDCha: 29,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 30,
      QuyenIDCha: 29,
      TenQuyen: 'Thêm biểu mẫu',
    },
    {
      QuyenID: 31,
      QuyenIDCha: 29,
      TenQuyen: 'Xem biểu mẫu',
    },
    {
      QuyenID: 32,
      QuyenIDCha: 29,
      TenQuyen: 'Tải biểu mẫu',
    },
    {
      QuyenID: 33,
      QuyenIDCha: 29,
      TenQuyen: 'In biểu mẫu',
    },
    {
      QuyenID: 34,
      TenQuyen: 'Quản Lý Loại Hộ Gia Đình',
    },
    {
      QuyenID: 136,
      QuyenIDCha: 34,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 35,
      QuyenIDCha: 34,
      TenQuyen: 'Thêm loại hộ',
    },
    {
      QuyenID: 36,
      QuyenIDCha: 34,
      TenQuyen: 'Sửa loại hộ',
    },
    {
      QuyenID: 37,
      QuyenIDCha: 34,
      TenQuyen: 'Xóa loại hộ',
    },
    {
      QuyenID: 38,
      TenQuyen: 'Quản Lý Khu Vực Rà Soát',
    },
    {
      QuyenID: 137,
      QuyenIDCha: 38,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 39,
      QuyenIDCha: 38,
      TenQuyen: 'Thêm khu vực rà soát',
    },
    {
      QuyenID: 40,
      QuyenIDCha: 38,
      TenQuyen: 'Sửa khu vực rà soát',
    },
    {
      QuyenID: 41,
      QuyenIDCha: 38,
      TenQuyen: 'Xóa khu vực rà soát',
    },
    {
      QuyenID: 42,
      TenQuyen: 'Quản Lý Vùng/Tỉnh',
    },
    {
      QuyenID: 138,
      QuyenIDCha: 42,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 43,
      QuyenIDCha: 42,
      TenQuyen: 'Thêm vùng',
    },
    {
      QuyenID: 44,
      QuyenIDCha: 42,
      TenQuyen: 'Xóa vùng',
    },
    {
      QuyenID: 45,
      QuyenIDCha: 42,
      TenQuyen: 'Thêm tỉnh',
    },
    {
      QuyenID: 46,
      QuyenIDCha: 42,
      TenQuyen: 'Sửa tỉnh',
    },
    {
      QuyenID: 47,
      QuyenIDCha: 42,
      TenQuyen: 'Xóa tỉnh',
    },
    {
      QuyenID: 48,
      TenQuyen: 'Quản Lý Huyện',
    },
    {
      QuyenID: 139,
      QuyenIDCha: 48,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 49,
      QuyenIDCha: 48,
      TenQuyen: 'Thêm huyện',
    },
    {
      QuyenID: 50,
      QuyenIDCha: 48,
      TenQuyen: 'Sửa huyện',
    },
    {
      QuyenID: 51,
      QuyenIDCha: 48,
      TenQuyen: 'Xóa huyện',
    },
    {
      QuyenID: 52,
      TenQuyen: 'Quản Lý Xã',
    },
    {
      QuyenID: 140,
      QuyenIDCha: 52,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 53,
      QuyenIDCha: 52,
      TenQuyen: 'Thêm xã',
    },
    {
      QuyenID: 54,
      QuyenIDCha: 52,
      TenQuyen: 'Sửa xã',
    },
    {
      QuyenID: 55,
      QuyenIDCha: 52,
      TenQuyen: 'Xóa xã',
    },
    {
      QuyenID: 56,
      TenQuyen: 'Quản Lý Thôn',
    },
    {
      QuyenID: 141,
      QuyenIDCha: 56,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 57,
      QuyenIDCha: 56,
      TenQuyen: 'Thêm thôn',
    },
    {
      QuyenID: 58,
      QuyenIDCha: 56,
      TenQuyen: 'Sửa thôn',
    },
    {
      QuyenID: 59,
      QuyenIDCha: 56,
      TenQuyen: 'Xóa thôn',
    },
    {
      QuyenID: 60,
      TenQuyen: 'Quản Lý Đơn Vị',
    },
    {
      QuyenID: 142,
      QuyenIDCha: 60,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 61,
      QuyenIDCha: 60,
      TenQuyen: 'Thêm đơn vị',
    },
    {
      QuyenID: 62,
      QuyenIDCha: 60,
      TenQuyen: 'Sửa đơn vị',
    },
    {
      QuyenID: 63,
      QuyenIDCha: 60,
      TenQuyen: 'Xóa đơn vị',
    },
    {
      QuyenID: 64,
      TenQuyen: 'Quản Lý Nghề Nghiệp',
    },
    {
      QuyenID: 143,
      QuyenIDCha: 64,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 65,
      QuyenIDCha: 64,
      TenQuyen: 'Thêm nghề nghiệp',
    },
    {
      QuyenID: 66,
      QuyenIDCha: 64,
      TenQuyen: 'Sửa nghề nghiệp',
    },
    {
      QuyenID: 99,
      QuyenIDCha: 64,
      TenQuyen: 'Xóa nghề nghiệp',
    },
    {
      QuyenID: 67,
      TenQuyen: 'Quản Lý Dân Tộc',
    },
    {
      QuyenID: 144,
      QuyenIDCha: 67,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 68,
      QuyenIDCha: 67,
      TenQuyen: 'Thêm dân tộc',
    },
    {
      QuyenID: 69,
      QuyenIDCha: 67,
      TenQuyen: 'Sửa dân tộc',
    },
    {
      QuyenID: 70,
      QuyenIDCha: 67,
      TenQuyen: 'Xóa dân tộc',
    },
    {
      QuyenID: 71,
      TenQuyen: 'Quản Lý Cán Bộ',
    },
    {
      QuyenID: 145,
      QuyenIDCha: 71,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 72,
      QuyenIDCha: 71,
      TenQuyen: 'Thêm cán bộ',
    },
    {
      QuyenID: 73,
      QuyenIDCha: 71,
      TenQuyen: 'Sửa cán bộ',
    },
    {
      QuyenID: 74,
      QuyenIDCha: 71,
      TenQuyen: 'Xóa cán bộ',
    },
    {
      QuyenID: 75,
      TenQuyen: 'Quản Lý Chính Sách',
    },
    {
      QuyenID: 146,
      QuyenIDCha: 75,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 76,
      QuyenIDCha: 75,
      TenQuyen: 'Thêm chính sách',
    },
    {
      QuyenID: 77,
      QuyenIDCha: 75,
      TenQuyen: 'Sửa chính sách',
    },
    {
      QuyenID: 78,
      QuyenIDCha: 75,
      TenQuyen: 'Xóa chính sách',
    },
    {
      QuyenID: 79,
      TenQuyen: 'Quản Lý Loại Tài Liệu',
    },
    {
      QuyenID: 147,
      QuyenIDCha: 79,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 80,
      QuyenIDCha: 79,
      TenQuyen: 'Thêm loại tài liệu',
    },
    {
      QuyenID: 81,
      QuyenIDCha: 79,
      TenQuyen: 'Sửa loại tài liệu',
    },
    {
      QuyenID: 82,
      QuyenIDCha: 79,
      TenQuyen: 'Xóa loại tài liệu',
    },
    {
      QuyenID: 83,
      TenQuyen: 'Quản Lý Quy Ước Tính Điểm',
    },
    {
      QuyenID: 148,
      QuyenIDCha: 83,
      TenQuyen: 'Xem',
    },
    {
      QuyenID: 84,
      QuyenIDCha: 83,
      TenQuyen: 'Thêm thông tin',
    },
    {
      QuyenID: 85,
      QuyenIDCha: 83,
      TenQuyen: 'Sửa thông tin',
    },
    {
      QuyenID: 86,
      QuyenIDCha: 83,
      TenQuyen: 'Xóa thông tin',
    },
    {
      QuyenID: 87,
      TenQuyen: 'Quản Trị Người Dùng',
    },
    {
      QuyenID: 88,
      QuyenIDCha: 87,
      TenQuyen: 'Thêm người dùng',
    },
    {
      QuyenID: 89,
      QuyenIDCha: 87,
      TenQuyen: 'Xem chi tiết người dùng',
    },
    {
      QuyenID: 90,
      QuyenIDCha: 87,
      TenQuyen: 'Chỉnh sửa chi tiết người dùng',
    },
    {
      QuyenID: 91,
      QuyenIDCha: 87,
      TenQuyen: 'Khóa tài khoản người dùng',
    },
    {
      QuyenID: 92,
      QuyenIDCha: 87,
      TenQuyen: 'Xóa người dùng',
    },
    {
      QuyenID: 93,
      TenQuyen: 'Phân Quyền Người Dùng',
    },
    {
      QuyenID: 94,
      QuyenIDCha: 93,
      TenQuyen: 'Thêm nhóm quyền',
    },
    {
      QuyenID: 95,
      QuyenIDCha: 93,
      TenQuyen: 'Sửa nhóm quyền',
    },
    {
      QuyenID: 96,
      QuyenIDCha: 93,
      TenQuyen: 'Xóa nhóm quyền',
    },
    {
      QuyenID: 97,
      QuyenIDCha: 93,
      TenQuyen: 'Xóa lựa chọn',
    },
    {
      QuyenID: 98,
      QuyenIDCha: 93,
      TenQuyen: 'Bỏ tất cả lựa chọn',
    },
  ];

  const idQuyen = defaultQuyen.map((item) => item.QuyenID);

  const truongTTRepository = connection.getRepository(BangTenTruongThongTinTVH);
  const bangRoleUserRepository = connection.getRepository(BangRoleUser);
  const bangRoleGroupRepository = connection.getRepository(BangRoleGroup);

  try {
    await Promise.all(
      defaultTruongTTTV.map(async (tr) => {
        // Kiểm tra xem dữ liệu đã tồn tại hay chưa
        const existingTruongTT = await truongTTRepository.findOne(
          tr.TruongThongTinID,
        );

        if (!existingTruongTT) {
          // Nếu chưa tồn tại, thêm dữ liệu mới
          const truongTT = truongTTRepository.create(tr);
          await truongTTRepository.save(truongTT);
        }
      }),
    );

    await Promise.all(
      defaultQuyen.map(async (tr) => {
        // Kiểm tra xem dữ liệu đã tồn tại hay chưa
        const existingQuyenID = await bangRoleUserRepository.findOne(
          tr.QuyenID,
        );

        if (!existingQuyenID) {
          // Nếu chưa tồn tại, thêm dữ liệu mới
          const roleUser = bangRoleUserRepository.create(tr);
          await bangRoleUserRepository.save(roleUser);
        }
      }),
    );

    const exisRoleAdmin = await bangRoleGroupRepository
      .createQueryBuilder('roleGroup')
      .where('roleGroup.TenNhomQuyen = :name', { name: 'admin' })
      .getOne();
    if (exisRoleAdmin) {
      exisRoleAdmin.NhomQuyen = JSON.stringify(idQuyen);
      await bangRoleGroupRepository.save(exisRoleAdmin);
    } else {
      const dataNhomQuyen = {
        TenNhomQuyen: 'ADMIN',
        NhomQuyen: JSON.stringify(idQuyen),
      };
      const nhomQuyen = await bangRoleGroupRepository.create(dataNhomQuyen);
      await bangRoleGroupRepository.save(nhomQuyen);
    }
    // console.log('exisRoleAdmin: ', exisRoleAdmin);

    console.log('Dữ liệu đã được seed thành công.');
    console.log('Tạo quyền thành công.');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
  }
}

async function main() {
  const app = await NestFactory.create(AppModule);

  const connection = app.get(Connection);

  // Chạy lệnh seedData để thêm dữ liệu vào bảng
  await seedData(connection);

  await app.close();
}

main();
