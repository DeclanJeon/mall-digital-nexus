import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import ProductRegistrationForm from '../products/ProductRegistrationForm';
import { Content } from '@/types/space';
import { Product } from '@/types/product';
import { saveProduct } from '@/services/storage/productStorage';
import { useSearchParams } from 'react-router-dom';
import productService from '@/services/productService';

interface PeerSpaceProductFormModalProps {
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  address: string;
  setProducts: React.Dispatch<React.SetStateAction<Content[]>>;
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
  products: Content[];
  contents: Content[];
}

const PeerSpaceProductFormModal: React.FC<PeerSpaceProductFormModalProps> = ({
  showProductForm,
  setShowProductForm,
  address,
  setProducts,
  setContents,
  products,
  contents,
}) => {
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');

  return (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader><DialogTitle className="text-xl font-bold">제품 등록</DialogTitle></DialogHeader>
        <ProductRegistrationForm 
          onProductSave={async (newProduct: Product) => {
            
            await productService.registerProduct(newProduct, address, peerMallKey);

            setProducts([...products, newProduct]);
            //setContents([...contents, productData]);
            setShowProductForm(false);
            toast({ title: "제품 등록 완료", description: `${newProduct.title} 제품이 등록되었습니다.` });
          }}
          address={address}
          onClose={() => setShowProductForm(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PeerSpaceProductFormModal;