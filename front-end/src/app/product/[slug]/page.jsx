'use client';
import React, { useEffect, useState } from 'react';
import ProductDetailItem from '@/components/ProductDetailItem';
import Overplay from '@/components/Overlay';
import ProductImageModal from '@/components/ProductImageModal';
import RelatedProduct from '@/components/RelatedProduct';
import TabInformation from '@/components/TabInformation';
import Breadcrumb from '@/components/Breadcrumb';
import { useParams } from 'next/navigation';
import { metadatasite } from '@/app/layout';
import { ProductDetailProvider } from '@/contexts/ProductDetailProdvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function DetailProduct() {
	const { slug } = useParams();
	const [showModal, setShowModal] = useState(false);
	const [product, setProduct] = useState({
		id:'',
		spuName: '',
		brand: {
			brandName: ''
		},
		images: [],
		categoryId: '',
		spuDescription: '',
		spuAttributes: {},
		spuPrice: 0,
		discount: 0,
		spuNo:''
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchProductDetail();
	}, []);

	const fetchProductDetail = async () => {
		setIsLoading(true)
		const response = await fetch(`http://localhost:8008/api/v1/spu?slug=${slug}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		})
		const data = await response.json()
		if (data.statusCode === 200) {
			const { spuName, brand, spuAttributes,discount, images,
				categoryId,
				spuDescription,id,skuList,spuNo } = data.metadata;
			setProduct({
				spuName,
				brand,
				spuAttributes: JSON.parse(spuAttributes),
				spuPrice: 100001,
				images,
				spuDescription,
				categoryId,
				discount,
				id,
				spuPrice: getSpuPrice(skuList),
				spuNo
			});
			metadatasite.title = spuName;
			setIsLoading(false)
		}
	}

	// get spu_price
	const getSpuPrice = (skuList) => {
		let minPrice = 0;
		skuList.forEach((sku) => {
			if (minPrice === 0) {
				minPrice = sku.skuPrice;
			}
			if (sku.skuPrice < minPrice) {
				minPrice = sku.skuPrice;
			}
		});
		return minPrice;
	}

	return (
		<ProductDetailProvider>
			{/* Product Image Model */}
			{product.images && product.images.length > 0 && (
				<>
					{/* Overlay */}
					<Overplay
						onClose={() => {
							setShowModal(false);
						}}
						visible={showModal}
					/>
					{/* Modal */}
					<ProductImageModal
						data={product.images}
						visible={showModal}
						onClose={() => {
							setShowModal(!showModal);
						}}
					/>
				</>
			)}

			<div className="">
				<Breadcrumb categoryId={product.categoryId} />
			</div>
			<div className="px-[200px] mt-3 h-[300px] grid grid-cols-2 gap-4">
				{/* product images */}
				<div className="">
					<button
						onClick={() => {
							if (product.images && product.images.length > 0) {
								setShowModal(!showModal);
							} else {
								alert('No image available');
							}
						}}
					>
						<img
							className="w-full h-full object-cover"
							src={
								product.images && product.images.length > 0
									? product.images[0].imgUrl
									: 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
							}
							alt=""
						/>
					</button>
				</div>
				<div>
					<ProductDetailItem
						handleProductImageClick={() => {
							setShowModal(!showModal);
						}}
						product={product}
						setProduct={setProduct}
						isLoading={isLoading}
					/>
				</div>
			</div>
			<div className="mt-[300px]">
				<TabInformation
					product={product}
					isLoading={isLoading}
				></TabInformation>
				<RelatedProduct
					categories={product.categoryId}
					isLoading={isLoading}
				/>
			</div>
			<ToastContainer />
		</ProductDetailProvider>
	);
}
