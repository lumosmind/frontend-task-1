import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteProductMutation } from "@data/product/product-delete.mutation";
import { MoreIcon } from "../icons/more-icon";
import { ProductIcon } from "../icons/product-icon";
import { Bell } from "../icons/bell";

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
      icon={<Bell className="mt-4 w-12 h-12 m-auto text-accent" />}
      title="export-items"
      // description="delete-selected-items-confirm"
      description="delete-selected-items-info"
      deleteBtnClassName="hidden"
      cancelBtnText="button-ok"
    />
  );
};

export default ProductDeleteView;
