---
foam_template:
  name: Default Note Template
  description: Template used by default for new notes.
  filepath: content/notes/${FOAM_DATE_YEAR}-${FOAM_DATE_MONTH}-${FOAM_DATE_DATE}-${FOAM_TITLE}.md
---

---
title: ${FOAM_TITLE}
date: ${FOAM_DATE_YEAR}-${FOAM_DATE_MONTH}-${FOAM_DATE_DATE}T${FOAM_DATE_HOUR}:${FOAM_DATE_MINUTE}:${FOAM_DATE_SECOND}Z
draft: true 
tags: ${1:tags}
---

$0
