"use client";
import React, { useEffect, useState } from "react";
import CartItem from "@/components/CartItem";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import { BsFillCartCheckFill } from "react-icons/bs";
import Cookies from "js-cookie";
import CartItemSkeleton from "@/components/CartItemSkeleton";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from "next/navigation";
import { useAppProvider } from "@/contexts/AppProvider";

export default function CartPage() {
   const [carts, setCarts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [totalPayment, setTotalPayment] = useState('');
   const router = useRouter();
   const { alertMessage, setAlertMessage, alertType, setAlertType, } = useAppProvider();
   const { getTotalCart } = useAppProvider();

   //Hàm định dạng giá
   const formatCurrencyVND = (amount) => {
      return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
   }


   useEffect(() => {
      if (alertMessage) {
         if (alertType === "success") {
            toast.success(alertMessage);
         }
         else if (alertType === "error") {
            toast.error(alertMessage);
         }
         setAlertMessage("");
         setAlertType("none");
      }
   }, [alertMessage])

   useEffect(() => {
      const cartCookie = Cookies.get("cart");
      if (cartCookie) {
         const parsedCart = JSON.parse(cartCookie);
         const fetchCartData = async () => {
            try {
               const responses = await Promise.all(
                  parsedCart.map((item) =>
                     fetch(`http://localhost:8008/api/v1/sku/${item.skuId}`).then((res) => res.json())
                  )
               );
               const enrichedCarts = responses.map((data, index) => ({
                  ...data,
                  quantity: parsedCart[index].quantity,
               }));
               setCarts(enrichedCarts);
            } catch (error) {
               toast.error("Không thể tải dữ liệu giỏ hàng");
            } finally {
               setIsLoading(false);
            }
         };
         fetchCartData();
      } else {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      let totalPayment = 0
      carts.map(cart => {
         totalPayment += cart.quantity * cart.skuPrice
      })
      console.log(totalPayment, 'price');
      setTotalPayment(totalPayment)
   }, [carts])

   const handleQuantityChange = (value, index) => {
      // Cập nhật số lượng trong carts
      const updatedCarts = carts.map((cart, i) =>
         i === index ? { ...cart, quantity: value } : cart
      );

      // Chỉ lấy id và quantity để lưu vào cookie
      const cookieData = updatedCarts.map(({ id, quantity }) => ({ skuId: id, quantity }));
      Cookies.set("cart", JSON.stringify(cookieData));

      setCarts(updatedCarts);
      getTotalCart()
   };

   const handleModalCancel = () => {
      setIsModalVisible(false);
   };

   const handleDeleteItem = (skuId) => {
      const updatedCarts = carts.filter(cart => cart.id !== skuId);

      const cookieData = updatedCarts.map(({ id, quantity }) => ({ skuId: id, quantity }));
      Cookies.set("cart", JSON.stringify(cookieData));

      setCarts(updatedCarts);
      getTotalCart()
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
   };

   useEffect(() => {
      const cartCookie = Cookies.get("cart");
      if (cartCookie) {
         const parsedCart = JSON.parse(cartCookie);
         const fetchCartData = async () => {
            try {
               const responses = await Promise.all(
                  parsedCart.map((item) =>
                     fetch(`http://localhost:8008/api/v1/sku/${item.skuId}`).then((res) => res.json())
                  )
               );
               const enrichedCarts = responses.map((data, index) => ({
                  ...data,
                  quantity: parsedCart[index].quantity,
               }));
               setCarts(enrichedCarts);
            } catch (error) {
               toast.error("Không thể tải dữ liệu giỏ hàng");
            } finally {
               setIsLoading(false);
            }
         };
         fetchCartData();
      } else {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      let totalPayment = 0
      carts.map(cart => {
         totalPayment += cart.quantity * cart.skuPrice
      })
      console.log(totalPayment, 'price');
      setTotalPayment(totalPayment)
   }, [carts])

   const handleOrderClick = () => {
      const firstname = localStorage.getItem("firstName");
      const lastname = localStorage.getItem("lastName");
      const phone = localStorage.getItem("phone");
      if (!firstname || !lastname || !phone) {
         setIsModalVisible(true);
         toast.error("Nhập thông tin khách hàng");
      } else {
         toast.success("Đơn hàng đang được xử lý");
         router.push("/order");
      }
   };

   const handleModalOk = () => {
      const firstname = document.getElementById("firstName").value;
      const lastname = document.getElementById("lastName").value;
      const phone = document.getElementById("userPhone").value;
      const phoneRegex = /^[0-9]{10}$/;

      if (firstname && lastname && phone && phoneRegex.test(phone)) {
         localStorage.setItem("firstName", firstname);
         localStorage.setItem("lastName", lastname);
         localStorage.setItem("phone", phone);
         setIsModalVisible(false);
         toast.success("Tài khoản đã được lưu, đơn hàng đang được xử lý");
         document.getElementById("firstName").value = "";
         document.getElementById("lastName").value = "";
         document.getElementById("userPhone").value = "";
         router.push("/order");
      } else {
         if (!phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ");
         } else {
            toast.error("Vui lòng nhập đầy đủ thông tin");
         }
      }
   };

   return (
      <div className="py-5 px-4 sm:px-6 md:px-10 lg:px-20 w-full flex flex-col bg-gray-50">
         {/* Tổng tiền đơn hàng */}
         <div className="flex flex-row justify-between items-center">
            <span className="uppercase text-xl sm:text-2xl md:text-3xl font-bold py-3 sm:py-4 md:py-5 text-gray-700">
               Giỏ hàng
            </span>
            <span className="text-lg sm:text-2xl font-bold mx-3">{`Tổng tiền: ${formatCurrencyVND(totalPayment)}`}</span>
         </div>

         {/* Desktop Table Layout */}
         <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-gray-300 shadow-sm rounded-lg">
               <thead className="bg-gray-200 text-gray-700 sm:uppercase text-xs sm:text-sm md:text-base">
                  <tr>
                     <th className="py-2 sm:py-3 px-2 sm:px-5 text-center">Hình ảnh</th>
                     <th className="py-2 sm:py-3 px-2 sm:px-5 text-center sm:text-start">Tên sản phẩm</th>
                     <th className="py-2 sm:py-3 px-2 sm:px-5 text-center">Đơn giá</th>
                     <th className="py-2 sm:py-3 px-2 sm:px-5 text-center">Số lượng</th>
                     <th className="py-2 sm:py-3 px-2 sm:px-5 text-center">Thành tiền</th>
                     <th className="py-2 sm:py-3 px-2 sm:px-5"></th>
                  </tr>
               </thead>
               <tbody className="bg-white text-sm sm:text-base">
                  {!isLoading ?
                     (carts.map((cart, index) => (
                        <CartItem
                           key={index}
                           cart={cart}
                           onQuantityChange={handleQuantityChange}
                           pos={index}
                           onDeleteItem={handleDeleteItem}
                           layout="desktop"
                        />
                     )))
                     :
                     (Array(5).fill().map((cart, index) => (
                        <CartItemSkeleton layout="desktop" />
                     )))
                  }
               </tbody>
            </table>
         </div>

         {/* Mobile List Layout */}
         <div className="block md:hidden space-y-4">
            {!isLoading ?
               (carts.map((cart, index) => (
                  <CartItem
                     key={index}
                     cart={cart}
                     onQuantityChange={handleQuantityChange}
                     pos={index}
                     onDeleteItem={handleDeleteItem}
                     layout="mobile"
                  />
               )))
               :
               (Array(5).fill().map((cart, index) => (
                  <CartItemSkeleton layout="mobile" />
               )))
            }
         </div>


         {/* Button */}
         <div className="flex justify-end space-x-4 my-6">

            {/* From Uiverse.io by AKAspidey01  */}
            <Button
               className="bg-white text-center w-[218px] rounded relative group"
            >
               <div
                  className="bg-green-400 rounded w-1/6 flex items-center justify-center absolute left-1 group-hover:w-[209px] z-10 duration-500"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 1024 1024"
                     height="25px"
                     width="25px"
                  >
                     <path
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                        fill="#000000"
                     ></path>
                     <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                        fill="#000000"
                     ></path>
                  </svg>
               </div>
               <p className="px-10 translate-x-2">Tiếp tục mua hàng</p>
            </Button>

            {/* <Button>Tiếp tục mua hàng</Button> */}
            {/* <Button disabled={carts.length <= 0 ? true: false} icon={<BsFillCartCheckFill size={22} />} >Đặt hàng</Button> */}
            <Button
               icon={<BsFillCartCheckFill size={22} />}
               onClick={handleOrderClick}
               disabled={carts.length <= 0 ? true : false}
            >
               Đặt hàng
            </Button>
         </div>

         {/* Modal */}
         <Modal
            title="Nhập thông tin người dùng"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="Lưu thông tin"
            cancelText="Hủy"
         >
            <div className="flex flex-col space-y-4">
               <input
                  id="firstName"
                  type="text"
                  placeholder="Nhập tên"
                  className="p-2 border border-gray-300 rounded"
               />
               <input
                  id="lastName"
                  type="text"
                  placeholder="Nhập họ"
                  className="p-2 border border-gray-300 rounded"
               />
               <input
                  id="userPhone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="p-2 border border-gray-300 rounded"
                  pattern="[0-9]{10}"
               />
            </div>
         </Modal>
      </div>
   );
}