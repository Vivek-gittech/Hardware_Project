import { PerspectiveCamera, View } from "@react-three/drei";
import type { MutableRefObject } from "react";
import { getVariant, type Product } from "@/lib/products";
import type { FinishId } from "./finishes";
import { Fit, ProductModel } from "./models";
import { Motion, StudioLights, type Interaction } from "./Studio";

export interface ProductViewProps {
  product: Product;
  finish?: FinishId;
  variantId?: string;
  interaction?: MutableRefObject<Interaction>;
  size?: number;
  className?: string;
}

export default function ProductViewImpl({ product, finish, variantId, interaction, size = 2.5, className }: ProductViewProps) {
  const variant = getVariant(product, variantId);
  const f = finish && product.finishes.includes(finish) ? finish : product.defaultFinish;
  return (
    <View className={className ?? ""}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={32} />
      <StudioLights />
      <Motion interaction={interaction} baseRotation={product.displayRotation}>
        <Fit size={size} deps={[product.id, variant.id]}>
          <ProductModel type={product.modelType} config={{ ...product.modelConfig, ...variant.config }} finish={f} animate />
        </Fit>
      </Motion>
    </View>
  );
}
