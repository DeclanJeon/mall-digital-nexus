import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, X, MessageCircle } from 'lucide-react';

interface ProductDetailPageProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize('');
      setSelectedColor('');
      setIsFavorite(false);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "사이즈를 선택해주세요",
        description: "제품을 장바구니에 추가하기 전에 사이즈를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "장바구니 담기",
      description: `${product?.title}이(가) 장바구니에 담겼습니다.`
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "사이즈를 선택해주세요",
        description: "구매하기 전에 사이즈를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "바로구매",
      description: "주문 페이지로 이동합니다."
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "찜 해제" : "찜하기",
      description: isFavorite ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다."
    });
  };

  if (!product) {
    return null;
  }

  const productImages = [
    product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
  ];

  const sizes = ['250', '260', '270', '280', '290'];
  const colors = [
    { name: 'Grey', value: '#9CA3AF', selected: true },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="border-b bg-gray-50 -mx-6 px-6 py-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <span>쿠팡홈</span>
            <span className="mx-2">&gt;</span>
            <span>쿠팡수입</span>
            <span className="mx-2">&gt;</span>
            <span>스포츠/레저</span>
            <span className="mx-2">&gt;</span>
            <span>스포츠신발</span>
            <span className="mx-2">&gt;</span>
            <span>런닝화/운동화</span>
            <span className="mx-2">&gt;</span>
            <span className="text-blue-600">런닝화</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white border rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-full object-contain p-8"
              />
            </div>

            <div className="flex gap-2">
              {productImages.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? 'text-orange-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">7개 상품평</span>
              </div>

              <div className="text-3xl font-bold text-red-600 mb-4">
                {formatPrice(Number(product.price) || 0)}원
              </div>

              <div className="text-sm text-gray-600 mb-2">
                무료배송
              </div>
              <div className="text-sm text-gray-600">
                모레(금) 5/30 도착 예정
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">사이즈</h3>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">사이즈 선택</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">색상</h3>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color.name ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                    ></button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">수량</h3>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-full text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                className="flex-1 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 장바구니 담기
              </Button>
              <Button
                className="flex-1 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                onClick={handleBuyNow}
              >
                바로구매
              </Button>
            </div>

            <div className="flex justify-around border-t border-b py-4 mt-6">
              <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-red-500" onClick={toggleFavorite}>
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-xs mt-1">찜하기</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
                <Share2 className="h-6 w-6" />
                <span className="text-xs mt-1">공유하기</span>
              </Button>
              <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-purple-500">
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">문의하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
