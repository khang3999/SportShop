package runtrail.dev.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runtrail.dev.backend.entities.SkuAttributeValueEntity;
import runtrail.dev.backend.repositories.SkuAttributeValueRepository;
import runtrail.dev.backend.services.SkuAttributeValueService;

import java.util.List;
import java.util.Optional;

@Service
public class SkuAttributeValueServiceImpl implements SkuAttributeValueService {

    @Autowired
    private SkuAttributeValueRepository skuAttributeValueRepository;

    
    @Override
    public List<SkuAttributeValueEntity> getAllSkuAttributeValues() {
        return skuAttributeValueRepository.findAll();
    }

    @Override
    public Optional<SkuAttributeValueEntity> getSkuAttributeValueById(long id) {
        return skuAttributeValueRepository.findById(id);
    }

    @Override
    public List<SkuAttributeValueEntity> getAllSkuAttributeValuesByCategoryId(long categoryId) {
        return skuAttributeValueRepository.findSkuAttributeValueEntitiesByCategoryId(categoryId);
    }

  
}
