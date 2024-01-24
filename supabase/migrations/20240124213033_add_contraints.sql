ALTER TABLE mangas_authors
 ADD CONSTRAINT mangas_authors_pk PRIMARY KEY (manga, author);

ALTER TABLE mangas_tags
 ADD CONSTRAINT mangas_tags_pk PRIMARY KEY (manga, tag);

ALTER TABLE mangas_groups
  ADD CONSTRAINT mangas_groups_pk PRIMARY KEY (manga, groupId);

ALTER TABLE mangas_parodies
  ADD CONSTRAINT mangas_parodies_pk PRIMARY KEY (manga, parody);

ALTER TABLE mangas_languages
  ADD CONSTRAINT mangas_languages_pk PRIMARY KEY (manga, language);

ALTER TABLE mangas_characters
  ADD CONSTRAINT mangas_characters_pk PRIMARY KEY (manga, characterId);
  
