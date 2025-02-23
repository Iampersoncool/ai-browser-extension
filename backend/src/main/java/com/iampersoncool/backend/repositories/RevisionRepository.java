package com.iampersoncool.backend.repositories;

import com.iampersoncool.backend.entities.Revision;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RevisionRepository extends CrudRepository<Revision, Long> {
    List<Revision> findAll();
}
