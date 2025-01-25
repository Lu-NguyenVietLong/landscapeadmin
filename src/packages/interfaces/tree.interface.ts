interface ITree {
    _id?: string;
    name: string; // Tên cây
    scientificName?: string; // Tên khoa học của cây
    sizes: Array<{
      size: string; // Kích thước cây
      price: number; // Giá cho kích thước này
    }>;
    discount?: number; // Giảm giá
    rating?: number; // Đánh giá
    sold?: number; // Số lượng đã bán
    imageUrl?: string[]; // URL hình ảnh cây
    description: string; // Mô tả sản phẩm
    careInstructions: string; // Hướng dẫn chăm sóc cây
    shipping?: 'Freeship' | 'Standard' | 'Express'; // Hình thức vận chuyển
    isAvailable?: boolean; // Trạng thái còn hàng hay hết hàng
    categories?: string[]; // Mảng chứa nhiều category, lưu các ObjectId dưới dạng string
    basicInfo?: {
      light?: string; // Ánh sáng
      watering?: string; // Tưới nước
      environment?: string; // Môi trường
      tips?: string; // Mẹo hay
    };
    shortDescription: string;
    keywords?: string[]; // Mảng chứa các từ khóa
    additionalInfo?: {
      height?: string; // Chiều cao cây
      toxicity?: string; // Độc tố (nếu có)
      careLevel?: string; // Mức độ chăm sóc (dễ, trung bình, khó)
      potSize?: string; // Kích thước chậu
    };
  }