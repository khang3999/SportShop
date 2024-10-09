package runtrail.dev.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runtrail.dev.backend.entity.SkuEntity;
import runtrail.dev.backend.service.SkuService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skus")
public class SkuController {

    @Autowired
    private SkuService skuService;


    // Lấy tất cả các SKU
    @GetMapping
    public ResponseEntity<List<SkuEntity>> getAllSkus() {
        List<SkuEntity> skus = skuService.getAllSkus();
        return new ResponseEntity<>(skus, HttpStatus.OK);
    }

    // Lấy SKU theo ID
    @GetMapping("/{id}")
    public ResponseEntity<SkuEntity> getSkuById(@PathVariable long id) {
        Optional<SkuEntity> sku = skuService.getSkuById(id);
        return sku.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}