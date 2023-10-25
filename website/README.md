# Bernt Popp personal website

The repository subfolder for my personal website.

To build the website execute following commands:

```
## load libraries
library(rmarkdown)
library(config)

project_topic <- "berntpopp"
project_name <- "website"
script_path <- "/"

## read configs
config_vars_proj <- config::get(file = Sys.getenv("CONFIG_FILE"),
    config = project_topic)

## set working directory
setwd(paste0(config_vars_proj$projectsdir, project_name, script_path))

# render the website
rmarkdown::render_site()
```

The CSL file is [American Psychological Association 7th edition, from Zotero](https://www.zotero.org/styles/apa).
