'use client';

import { useState } from 'react';
import HSCodeSearch from './HSCodeSearch';
import { ArrowRight, ArrowLeft, Package, Trash2 } from 'lucide-react';

interface Product {
  hsCode: string;
  name: string;
}

interface ProductSelectionStepProps {
  initialProducts?: Product[];
  onNext: (data: { products: Product[] }) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export default function ProductSelectionStep({ 
  initialProducts = [], 
  onNext, 
  onBack, 
  loading 
}: ProductSelectionStepProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialProducts);

  const handleAddProduct = (item: { code: string; description: string }) => {
    if (selectedProducts.find((p) => p.hsCode === item.code)) return;
    
    // We use the chapter's description as the default product name
    // The user can edit details in a full marketplace flow, but for onboarding we keep it simple
    setSelectedProducts([...selectedProducts, { hsCode: item.code, name: item.description }]);
  };

  const handleRemoveProduct = (hsCode: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.hsCode !== hsCode));
  };

  const handleSubmit = () => {
    if (selectedProducts.length > 0) {
      onNext({ products: selectedProducts });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display text-text-primary">What products do you handle?</h2>
        <p className="mt-2 text-text-secondary">Search and select the main categories of products you trade.</p>
      </div>

      <div className="space-y-6">
        <HSCodeSearch 
          onSelect={handleAddProduct} 
          selectedCodes={selectedProducts.map(p => p.hsCode)} 
          maxSelected={5}
        />

        {selectedProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Selected Products ({selectedProducts.length}/5)</h3>
            <div className="grid gap-3">
              {selectedProducts.map((product) => (
                <div 
                  key={product.hsCode}
                  className="flex items-center justify-between p-4 rounded-xl border border-bmn-border bg-white shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-bmn-blue">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">Chapter {product.hsCode}</div>
                      <div className="text-sm text-text-secondary truncate max-w-[250px] md:max-w-[400px]">
                        {product.name}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(product.hsCode)}
                    className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProducts.length === 0 && (
          <div className="py-12 border-2 border-dashed border-bmn-border rounded-xl text-center">
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-text-secondary text-sm">No products selected. Search above to add products.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedProducts.length === 0 || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Next Step'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
