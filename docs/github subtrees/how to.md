# Usage des git subtrees

Docs: [source](https://gauthier.frama.io/post/git-subtree/)

**Note :** Usage du point 2.2

## Usage

### Mise a jour du subtree du projet

```bash
git fetch resources-and-management main
git subtree pull --prefix public/resources-and-management resources-and-management main --squash
```
