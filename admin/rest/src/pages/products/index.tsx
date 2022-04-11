import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { Product, SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useProductsQuery } from "@data/product/products.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SortForm from "@components/common/sort-form";
import CategoryTypeFilter from "@components/product/category-type-filter";
import cn from "classnames";
import { ArrowDown } from "@components/icons/arrow-down";
import { ArrowUp } from "@components/icons/arrow-up";
import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";

export default function ProductsPage() {
  const { openModal } = useModalAction();
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);

  console.log(sortedBy);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const {
    data,
    isLoading: loading,
    error,
  } = useProductsQuery({
    limit: 20,
    page,
    type,
    category,
    text: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }

  function downloadObjectAsJson(exportObj: Product[], exportName: string) {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const [getSelectedItems, assignGetSelectedItems] = (function () {
    let getSelectedItemsFunction: () => Product[] = () => {
      throw new Error("Not Implemented");
    };

    const getSelectedItems = () => getSelectedItemsFunction();

    const assignGetSelectedItems = (func: () => Product[]) => {
      getSelectedItemsFunction = func;
    };

    return [getSelectedItems, assignGetSelectedItems];
  })();

  const onExportClick = () => {
    console.log("exporting...");
    console.log("getSelectedItems", getSelectedItems());
    downloadObjectAsJson(getSelectedItems(), "products");
  };

  function onDelete() {
    //get product ids from product-list  to delete
    const ids = getSelectedItems().map((product) => product.id);
    console.log("ids", ids);

    if (ids.length === 0) {
      openModal("DELETE_PRODUCTS_ALERT", ids);
      return;
    }

    // show confirmation modal
    openModal("DELETE_PRODUCTS", ids);

    //send delte request to rest api
  }

  return (
    <>
      <Card className="flex flex-col mb-8">
        <div className="w-full flex flex-col md:flex-row items-center">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <h1 className="text-lg font-semibold text-heading">
              {t("form:input-label-products")}
            </h1>
          </div>

          <div className="w-full md:w-3/4 flex flex-col items-center ms-auto">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="text-accent text-base font-semibold flex items-center md:ms-5 mt-5 md:mt-0"
            onClick={toggleVisible}
          >
            {t("common:text-filter")}{" "}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn("w-full flex transition", {
            "h-auto visible": visible,
            "h-0 invisible": !visible,
          })}
        >
          <div className="flex flex-col md:flex-row md:items-center mt-5 md:mt-8 border-t border-gray-200 pt-5 md:pt-8 w-full">
            <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={({ slug }: { slug: string }) => {
                setCategory(slug);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
              }}
            />
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center py-4 px-2 border-4 border-solid *border-red-500">
          <Button
            size="small"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 rounded inline-flex items-center ml-3.5 hover:hover:border-current"
            onClick={onExportClick}
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Export</span>
          </Button>

          <Button
            // className="btn btn-outline-info btn-sm"
            size="small"
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded ml-4"
            onClick={() => onDelete()}
          >
            Delete
          </Button>
        </div>
      </Card>
      <ProductList
        products={data?.products}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        assignGetSelectedItems={assignGetSelectedItems}
      />
    </>
  );
}
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
