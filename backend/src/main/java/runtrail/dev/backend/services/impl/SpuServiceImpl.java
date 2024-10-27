package runtrail.dev.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import runtrail.dev.backend.dto.response.SpuDTO;
import runtrail.dev.backend.entities.SpuEntity;
import runtrail.dev.backend.entities.SpuImagesEntity;
import runtrail.dev.backend.exception.ErrorExceptionHandler;
import runtrail.dev.backend.repositories.SpuImagesRepository;
import runtrail.dev.backend.repositories.SpuRepository;
import runtrail.dev.backend.repositories.specification.SpuSpecification;
import runtrail.dev.backend.services.SkuService;
import runtrail.dev.backend.services.SpuService;

import java.util.*;
import java.util.List;

@Service
public class SpuServiceImpl implements SpuService {

    @Autowired
    private SpuRepository spuRepository;

    @Autowired
    private SkuService skuService;

    @Autowired
    private SpuImagesRepository spuImagesRepository;

    @Override
    public List<SpuEntity> getAllSpus() {
        return List.of();
    }

    @Override
    public Optional<SpuEntity> getSpuById(long id) {
        return Optional.empty();
    }

    @Override
    public Page<SpuEntity> findAllSpu(Pageable pageable) {
        return spuRepository.findAll(pageable);
    }



    public Page<SpuDTO> getSpuByFilter(long minPrice,long maxPrice,List<Long> brandIds, Long categoryId, String key, List<String> value, Pageable pageable) {
        brandIds = brandIds.isEmpty() ? null : brandIds;
        categoryId = categoryId == -1 ? null : categoryId;
        key = key.isEmpty() ? null : key;
        value = value.isEmpty() ? null : value;

        return spuRepository.findBySpuFilter(minPrice,maxPrice, brandIds, categoryId, key, value, pageable);
    }

    @Override
    public Page<SpuEntity> filterProductV2(Long minPrice, Long maxPrice, List<Long> brandIds, Long categoryId, List<String> keys, List<List<String>> values,Pageable pageable) {
        final Specification<SpuEntity>specification = SpuSpecification.filterProduct(minPrice, maxPrice, brandIds, categoryId, keys, values);
        return spuRepository.findAll(specification,pageable);
    }

    @Override
    public SpuEntity findProductBySlug(String slug) {
        //
       final SpuEntity spu = spuRepository.findBySlug(slug);
       if (spu == null) {
           throw new ErrorExceptionHandler("Product not found", HttpStatus.NOT_FOUND.value());
       }

       return spu;
    }


    @Override
    public Page<SpuDTO> getSpuByQuickFilter(long minPrice,long maxPrice,List<Long> brandIds, Long categoryId, String key, List<String> value, String contentOrderBy, Pageable pageable) {
        brandIds = brandIds.isEmpty() ? null : brandIds;
        categoryId = categoryId == -1 ? null : categoryId;
        key = key.isEmpty() ? null : key;
        value = value.isEmpty() ? null : value;
          if (contentOrderBy.equals("asc")) {
            return spuRepository.findBySpuFilterASCNew(minPrice, maxPrice, brandIds,categoryId, key, value, pageable);
         }
         else if(contentOrderBy.equals("desc")) {
             return spuRepository.findBySpuFilterDESCNew(minPrice, maxPrice, brandIds,categoryId, key, value, pageable);
         } else {
              return spuRepository.findBySpuFilterSALE(minPrice, maxPrice, brandIds,categoryId, key, value, pageable);
          }
    }

    public List<SpuDTO> getRelatedProduct(long category,int number) {
        // Lấy 20 sản phẩm có mã giảm giá cao nhất
        Pageable pageable = PageRequest.of(0, 20);
        List<SpuDTO> topDiscountedProducts = spuRepository.findTopDiscountedSpuByCategory(category, pageable);
        List<SpuDTO> selectedProducts = new ArrayList<>();

        // Lấy 6 sản phẩm ngẫu nhiên từ danh sách 20 sản phẩm
        if (!topDiscountedProducts.isEmpty()) {
            Collections.shuffle(topDiscountedProducts);
            for (SpuDTO product : topDiscountedProducts) {
                if (selectedProducts.size() >= number) break;
                selectedProducts.add(product);
            }
        }

        //  thêm sản phẩm ngẫu nhiên từ tất cả các sản phẩm
        while (selectedProducts.size() < number) {
            int remainingCount = number - selectedProducts.size();
            List<SpuDTO> randomProducts = spuRepository.findRandomProducts(Pageable.ofSize(remainingCount));

            // Neu hong con sp can them
            if (randomProducts.isEmpty()) {
                break;
            }

            // Lọc sản phẩm
            for (SpuDTO product : randomProducts) {
                if (selectedProducts.size() >= number) break;

                // Kiểm tra xem sản phẩm đã có trong selectedProducts hay chưa
                if (selectedProducts.stream().noneMatch(p -> p.getId() == product.getId())) {
                    selectedProducts.add(product);
                }
            }
        }

        // Thêm danh sách  ảnh cho mỗi sp
        selectedProducts.forEach(product -> {
            List<SpuImagesEntity> images = spuImagesRepository.findBySpuId(product.getId());
            product.setImages(images);
        });

        return selectedProducts;
    }





    public List<SpuDTO> get20spTop(long category) {
        // Lấy 20 sản phẩm có mã giảm giá cao nhất
        Pageable pageable = PageRequest.of(0, 20);
        List<SpuDTO> selectedProducts = spuRepository.findTopDiscountedSpuByCategory(category, pageable);

        // Gan danh sach anh
        selectedProducts.forEach(product -> {
            List<SpuImagesEntity> images = spuImagesRepository.findBySpuId(product.getId());
            product.setImages(images);
        });

        return selectedProducts;
    }

    public List<String> getDistinctSizesByCategoryId(Long categoryId) {
        return spuRepository.findDistinctSizesByCategoryId(categoryId);
    }

}
