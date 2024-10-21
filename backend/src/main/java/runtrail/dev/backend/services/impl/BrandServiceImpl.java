package runtrail.dev.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runtrail.dev.backend.entities.BrandEntity;
import runtrail.dev.backend.repositories.BrandRepository;
import runtrail.dev.backend.services.BrandService;

import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<BrandEntity> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Optional<BrandEntity> getBrandById(long id) {
        return brandRepository.findById(id);
    }

}