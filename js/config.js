/**
 * config.js
 * Solia Virtual Tour — Orange/Gold Luxury Design System
 * Dynamic Tour Configurations & Scene Database
 */

const SoliaConfig = {
  tourTitle: "Genera",
  logoUrl: "menu/image/generalogo.png",
  googleMapUrl: "https://www.google.com/maps/d/u/0/embed?mid=1wO283wRXlQpxnFJKBGZQm4cyvEew0l4",
  websiteUrl: "https://genera.homegroup.com.vn/",

  // Grouped Menu Structure
  menuGroups: [
    {
      id: "tong_quan",
      title: "TỔNG QUAN DỰ ÁN",
      icon: "explore", // Group-level icon
      items: [
        {
          name: "scene_Lipqn_ktglt_vpfng",
          title: "Liên kết vùng",
          icon: "explore"
        },
        {
          name: "scene_Tthvng_quan_1",
          title: "Tổng quan - View 1",
          icon: "photo_camera"
        },
        {
          name: "scene_Tthvng_quan_2",
          title: "Tổng quan - View 2",
          icon: "photo_camera"
        },
        {
          name: "scene_Tthvng_quan_3",
          title: "Tổng quan - View 3",
          icon: "photo_camera"
        },
        {
          name: "scene_Tthvng_quan_4",
          title: "Tổng quan - View 4",
          icon: "photo_camera"
        },
        {
          name: "scene_Cthvng_vpgo_dthx_phn",
          title: "Cổng vào dự án",
          icon: "door_front"
        }
      ]
    },
    {
      id: "phan_khu",
      title: "CÁC PHÂN KHU",
      icon: "apartment", // Group-level icon
      items: [
        {
          name: "scene_View_trung_tpim_dthx_phn",
          title: "View trung tâm",
          icon: "center_focus_strong"
        },
        {
          name: "scene_Phpin_khu_1_-_Athena",
          title: "Phân khu 1 - Athena",
          icon: "apartment"
        },
        {
          name: "scene_Phpin_khu_2_-_Apollo",
          title: "Phân khu 2 - Apollo",
          icon: "apartment"
        },
        {
          name: "scene_Phpin_khu_3_-_Flora",
          title: "Phân khu 3 - Flora",
          icon: "nature_people"
        }
      ]
    },
    {
      id: "nha_mau",
      title: "NHÀ MẪU",
      icon: "home", // Group-level icon
      items: [
        {
          name: "scene_Nhpg_mtgru",
          title: "Mặt ngoài nhà mẫu",
          icon: "home"
        },
        {
          name: "scene_Trthlc_chptnh_nhpg_mtgru",
          title: "Trục chính nhà mẫu",
          icon: "navigation"
        }
      ]
    },
    {
      id: "tien_ich",
      title: "TIỆN ÍCH",
      icon: "pool", // Group-level icon
      items: [
        {
          name: "scene_Clubhouse_-_Htht_bshi",
          title: "Clubhouse - Hồ bơi",
          icon: "pool"
        },
        {
          name: "scene_Spin_ththd_thao_-_Spin_chshi_trtgh_em",
          title: "Sân thể thao & Trẻ em",
          icon: "sports_soccer"
        },
        {
          name: "scene_Cpang_vipqn_-_qqpgi_phun_nswthbc",
          title: "Công viên & Đài phun nước",
          icon: "forest"
        }
      ]
    }
  ],

  // Extra scene details for Popup card information
  sceneDetails: {
    "scene_Lipqn_ktglt_vpfng": {
      title: "Liên kết vùng",
      description: "Vị trí chiến lược kết nối trực tiếp các khu công nghiệp trọng điểm như KCN Phú An Thạnh, KĐT Waterpoint, KĐT LA Home và KCN Prodezi, đem lại giá trị giao thương vượt trội cho dự án Genera.",
      image: "panos/Lipqn_ktglt_vpfng.tiles/thumb.jpg"
    },
    "scene_Tthvng_quan_1": {
      title: "Tổng quan - View 1",
      description: "Góc nhìn Panorama bao quát toàn cảnh dự án Genera từ trên cao, làm nổi bật sơ đồ quy hoạch đồng bộ, hiện đại.",
      image: "panos/Tthvng_quan_1.tiles/thumb.jpg"
    },
    "scene_Tthvng_quan_2": {
      title: "Tổng quan - View 2",
      description: "Góc nhìn từ phía Đông Nam hướng về quảng trường trung tâm, phác họa trục cảnh quan xanh trải dài toàn phân khu.",
      image: "panos/Tthvng_quan_2.tiles/thumb.jpg"
    },
    "scene_Tthvng_quan_3": {
      title: "Tổng quan - View 3",
      description: "Tầm nhìn bao quát hướng trực diện sông, tận hưởng tối đa bầu không khí mát lành tự nhiên bao bọc dự án.",
      image: "panos/Tthvng_quan_3.tiles/thumb.jpg"
    },
    "scene_Tthvng_quan_4": {
      title: "Tổng quan - View 4",
      description: "Phối cảnh hoàng hôn tuyệt đẹp trải dài trên toàn dự án Genera, thắp sáng nét kiêu sa của dòng sản phẩm bất động sản hạng sang.",
      image: "panos/Tthvng_quan_4.tiles/thumb.jpg"
    },
    "scene_Cthvng_vpgo_dthx_phn": {
      title: "Cổng vào dự án",
      description: "Cổng chào bề thế mang ngôn ngữ kiến trúc đương đại cao cấp, mở ra không gian sống sang trọng xứng tầm thượng lưu.",
      image: "panos/Cthvng_vpgo_dthx_phn.tiles/thumb.jpg"
    },
    "scene_View_trung_tpim_dthx_phn": {
      title: "View trung tâm dự án",
      description: "Giao điểm phồn hoa của toàn dự án, nơi kết nối nhanh chóng đến tổ hợp clubhouse, sân thể thao và công viên nội khu.",
      image: "panos/View_trung_tpim_dthx_phn.tiles/thumb.jpg"
    },
    "scene_Phpin_khu_1_-_Athena": {
      title: "Phân khu 1 - Athena",
      description: "Phân khu mang phong cách thiết kế Hy Lạp tân cổ điển quý phái, nơi hội tụ các căn biệt thự hướng hồ bơi sinh thái đặc quyền.",
      image: "panos/Phpin_khu_1_-_Athena.tiles/thumb.jpg"
    },
    "scene_Phpin_khu_2_-_Apollo": {
      title: "Phân khu 2 - Apollo",
      description: "Phân khu sôi động bậc nhất dự án với dãy shophouse thương mại cao cấp tiếp giáp trực tiếp đường trục chính.",
      image: "panos/Phpin_khu_2_-_Apollo.tiles/thumb.jpg"
    },
    "scene_Phpin_khu_3_-_Flora": {
      title: "Phân khu 3 - Flora",
      description: "Không gian sống xanh mát ngập tràn sắc hoa và bóng mát cây xanh, mang đến cuộc sống bình yên chuẩn resort dưỡng sinh.",
      image: "panos/Phpin_khu_3_-_Flora.tiles/thumb.jpg"
    },
    "scene_Nhpg_mtgru": {
      title: "Nhà mẫu biệt thự",
      description: "Biệt thự mẫu thực tế được thiết kế tinh xảo với kính tràn viền Low-E cao kịch trần, tối ưu góc nhìn thiên nhiên ngoạn mục.",
      image: "panos/Nhpg_mtgru.tiles/thumb.jpg"
    },
    "scene_Trthlc_chptnh_nhpg_mtgru": {
      title: "Trục chính nhà mẫu",
      description: "Đại lộ nội khu thênh thang dẫn trực tiếp vào phân khu nhà mẫu và văn phòng điều hành của Solia.",
      image: "panos/Trthlc_chptnh_nhpg_mtgru.tiles/thumb.jpg"
    },
    "scene_Clubhouse_-_Htht_bshi": {
      title: "Clubhouse - Hồ bơi",
      description: "Hồ bơi tràn viền vô cực 3 tầng tiêu chuẩn Olympic kết hợp quầy bar chìm sang chảnh, tạo điểm hẹn lý tưởng cho cư dân.",
      image: "panos/Clubhouse_-_Htht_bshi.tiles/thumb.jpg"
    },
    "scene_Spin_ththd_thao_-_Spin_chshi_trtgh_em": {
      title: "Sân thể thao - Sân chơi trẻ em",
      description: "Tổ hợp thể thao đa năng ngoài trời gồm sân tennis, pickleball cùng khu vui chơi cát cát an toàn cho bé yêu phát triển thể chất.",
      image: "panos/Spin_ththd_thao_-_Spin_chshi_trtgh_em.tiles/thumb.jpg"
    },
    "scene_Cpang_vipqn_-_qqpgi_phun_nswthbc": {
      title: "Công viên - Đài phun nước",
      description: "Quảng trường nhạc nước kết hợp đài phun nghệ thuật độc đáo, nơi diễn ra các hoạt động lễ hội và sự kiện cộng đồng đặc sắc.",
      image: "panos/Cpang_vipqn_-_qqpgi_phun_nswthbc.tiles/thumb.jpg"
    }
  }
};
