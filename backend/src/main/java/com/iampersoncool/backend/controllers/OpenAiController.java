package com.iampersoncool.backend.controllers;

import com.iampersoncool.backend.entities.Revision;
import com.iampersoncool.backend.repositories.RevisionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

class ReviseInput {
    private String text;

    private Long parentId;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}

@RestController
@RequestMapping("/api/openai")
public class OpenAiController {
    private RevisionRepository revisionRepository;
    public OpenAiController(RevisionRepository revisionRepository) {
        this.revisionRepository = revisionRepository;
    }

    @GetMapping("/revisions")
    public List<Revision> getOpenAiRevisions() {
        List<Revision> revisions = revisionRepository.findAll();
        return revisions;
    }

    @GetMapping("/revisions/delete")
    public ResponseEntity<String> deleteOpenAiRevision(@RequestParam Long revisionId) {
        revisionRepository.deleteById(revisionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/revise")
    public ResponseEntity<Revision> reviseOpenAiRevision(@RequestBody ReviseInput input) {
        if (input.getParentId() == null) {
            Revision newParentRevision = new Revision(input.getText(), "default response text");
            revisionRepository.save(newParentRevision);

            return ResponseEntity.status(HttpStatus.CREATED).body(newParentRevision);
        }

        Optional<Revision> parentRevisionOptional = revisionRepository.findById(input.getParentId());
        if (parentRevisionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Revision parentRevision = parentRevisionOptional.get();

        Revision newChildRevision = new Revision(input.getText(), "default response text");
        parentRevision.getRevisions().add(newChildRevision);

        revisionRepository.save(parentRevision);
        return ResponseEntity.status(HttpStatus.CREATED).body(newChildRevision);
    }
}
