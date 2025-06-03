import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Image,
  Link,
  ShoppingBag,
  Truck,
  Factory,
  QrCode,
  Download,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductRegistrationForm";

interface ProductRegistrationPreviewProps {
  form: UseFormReturn<ProductFormValues>;
  previewImage: string;
  productTags: string[];
  options: { name: string; values: string[] }[];
  qrCodeUrl: string;
  qrRef: React.RefObject<HTMLDivElement>;
  address: string;
  downloadQRCode: () => void;
}

const PRODUCT_CATEGORIES = [
  { id: 1, name: '가전/디지털' },
  { id: 2, name: '패션의류' },
  { id: 3, name: '식품/생필품' },
  { id: 4, name: '가구/인테리어' },
  { id: 5, name: '스포츠/레저' },
  { id: 6, name: '뷰티/화장품' },
  { id: 7, name: '취미/문구' },
  { id: 8, name: '도서/음반' },
  { id: 9, name: '기타' }
];

const ProductRegistrationPreview: React.FC<ProductRegistrationPreviewProps> = ({
  form,
  previewImage,
  productTags,
  options,
  qrCodeUrl,
  qrRef,
  address,
  downloadQRCode
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-700">상품 미리보기</h3>
        <Card className="overflow-hidden">
          <div className="aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="상품 이미지 미리보기"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Image className="h-12 w-12 mb-2" />
                <p>이미지 미리보기</p>
              </div>
            )}
          </div>

          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-xl text-gray-800 line-clamp-2">
                {form.watch("name") || "상품명"}
              </h3>
              {form.watch("isPublic") ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">공개</Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">비공개</Badge>
              )}
            </div>

            {form.watch("title") && (
              <p className="text-sm text-gray-500 mb-3">{form.watch("title")}</p>
            )}

            <div className="flex justify-between items-center mb-4">
              <p className="text-blue-600 font-bold text-xl">
                {form.watch("price") || "가격"}
              </p>
              {form.watch("stock") && (
                <p className="text-sm text-gray-500">재고: {form.watch("stock")}</p>
              )}
            </div>

            {form.watch("categoryId") && (
              <Badge variant="secondary" className="mb-3">
                {PRODUCT_CATEGORIES.find(cat => cat.id.toString() === form.watch("categoryId"))?.name || "카테고리"}
              </Badge>
            )}

            {productTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {productTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-3" />

            {(form.watch("distributor") || form.watch("manufacturer")) && (
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {form.watch("manufacturer") && (
                  <div className="flex items-center">
                    <Factory className="h-4 w-4 mr-2 text-gray-400" />
                    <span>제조: {form.watch("manufacturer")}</span>
                  </div>
                )}
                {form.watch("distributor") && (
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-gray-400" />
                    <span>유통: {form.watch("distributor")}</span>
                  </div>
                )}
              </div>
            )}

            {form.watch("description") && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">상품 설명</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {form.watch("description")}
                </p>
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">옵션</h4>
                <div className="space-y-2">
                  {options.map((opt, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{opt.name}:</span>{" "}
                      <span className="text-gray-600">{opt.values.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
            <div className="flex items-center text-sm text-blue-600">
              <Link className="h-4 w-4 mr-1" />
              <span>판매 링크로 이동</span>
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span>담기</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-700">QR 코드 및 공유 정보</h3>
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-4 rounded-md mb-4 border border-gray-100" ref={qrRef}>
                {qrCodeUrl ? (
                  <QRCodeSVG value={qrCodeUrl} size={180} />
                ) : (
                  <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                    <QrCode className="h-12 w-12" />
                  </div>
                )}
              </div>
              {qrCodeUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  QR 코드 다운로드
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">판매 URL</h4>
                <div className="flex items-center gap-2">
                  <Input
                    value={form.watch("saleUrl")}
                    readOnly
                    className="bg-gray-50 text-gray-600"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(form.watch("saleUrl"));
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>URL 복사하기</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">피어몰 정보</h4>
                <div className="p-3 rounded-md bg-gray-50 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">피어몰 주소:</span>
                    <span className="font-medium">{address || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductRegistrationPreview;
