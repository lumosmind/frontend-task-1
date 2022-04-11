import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteProductMutation } from "@data/product/product-delete.mutation";

const ProductDeleteView = () => {
  const { mutate: deleteProduct, isLoading: loading } =
    useDeleteProductMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  async function handleDelete() {
    data.forEach((id: string) => {
      console.log(`#${id} product has been deleting...`);
      deleteProduct(id);
    });
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
      // title="My Custom Delet Modal"
      description="delete-selected-items-confirm"
    />
  );
};

export default ProductDeleteView;
