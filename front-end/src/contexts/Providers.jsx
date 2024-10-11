import React from 'react';
import AppProvider from './AppProvider';
import ProductProvider from './ProductProvider';
import FilterProvider from './FilterProductProvider';

const combineProviders = (...providers) =>
	providers.reduce(
		(Combined, Provider) =>
			({ children }) => (
				<Combined>
					<Provider>{children}</Provider>
				</Combined>
			),
		({ children }) => <>{children}</> // Trả về children nếu không có provider nào
	);

const Providers = combineProviders(
	AppProvider, // Thêm AppProvider
	ProductProvider, // Thêm ProductProvider
	FilterProvider // Thêm FilterProvider
);

export default Providers;