"use client";
import React, { useEffect } from "react";
import ProductGrid from "@/components/GridProduct";
import SideBarProduct from "@/components/SideBarProduct";
import styles from "./Products.module.css";
import QuickFilter from "@/components/Filters/QuickFilter";
import { useProductProvider } from "@/contexts/ProductProvider";
import Breadcrumb from "@/components/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import GoToTopButton from "@/components/GoToTopButton";
const ProductPage = ({ }) => {
   const {
      currentPage,
      contentOrderBy,
      selectedBrands,
      selectedSizes,
      minPrice,
      maxPrice,
      categoryId,
      fetchProducts
   } = useProductProvider();

   useEffect(() => {
      fetchProducts();
   }, [
      currentPage,
      contentOrderBy,
      selectedBrands,
      selectedSizes,
      minPrice,
      maxPrice,
      categoryId,
   ]);

   return (
      <PageTitle title={"Home Page"}>
         <div className={""}>
            <Breadcrumb categoryId={categoryId} />
            <div className={styles.mainContent}>
               <div className={styles.sidebar}>
                  <SideBarProduct categoryId={categoryId} />
               </div>
               <div className={styles.productSection}>
                  <QuickFilter />
                  <ProductGrid />
               </div>
            </div>
            <GoToTopButton />
         </div>
      </PageTitle>
   );
};

export default ProductPage;