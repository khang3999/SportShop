'use client';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './grid_product.module.css';
import { useProductProvider } from '@/contexts/ProductProvider';
import Pagination from '../Pagination';
import ProductItemSkeleton from '../productItemSkeleton';
import ProductItem from '../productItem';

const ProductGrid = () => {
	const {
		products,
		isLoading,
		currentPage,
		setCurrentPage,
		productsPerPage,
		totalPages,
		currentProducts,
	} = useProductProvider();

	if (isLoading) {
		return (
			<div>
				<div className={styles.grid} >
					{Array(productsPerPage).fill(0)
						.map((_, index) => (
							<ProductItemSkeleton />
						))}
				</div>
			</div>
		);
	}

	if (products.length === 0 && !isLoading) {
		return (
			<h1 style={{ color: 'red', fontSize: '20px' }}>
				Không tìm thấy sản phẩm
			</h1>
		);
	}

	return (
		<div>
			<div className={styles.grid}>
				{products.map((product) => (
					<>
						<ProductItem product={product} />
					</>

				))}
			</div>

			<Pagination />
		</div>
	);
};

export default ProductGrid;