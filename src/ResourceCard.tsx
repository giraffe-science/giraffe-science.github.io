import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {Resource} from "./Library";
import {useClasses} from "./styles";

export function ResourceCard({resource, i}: { resource: Resource, i: number }) {
    const classes = useClasses();
    return <Card className={classes.resourceCard} key={i}>
        <CardContent className={classes.resourceCardContent}>
            <Typography className={classes.resourceTitle} variant="h5"
                        component="h5">{resource.title || resource.summary || (resource.type === "" +
                "" && resource.references.find(r => r.type === "url")?.value.sub)}</Typography>
            {resource.summary && <Typography variant="body1">{resource.summary}</Typography>}
            {resource.type &&
            <Grid container alignContent="flex-start" alignItems="flex-start">
              <Typography className={classes.resourceType} gutterBottom display="inline">
                  {resource.type.toUpperCase()}
              </Typography>
              <Typography className={classes.resourceType} gutterBottom display="inline">&nbsp;|&nbsp;</Typography>
              <Typography className={classes.resourceType} gutterBottom display="inline" color="textSecondary">
                  {resource.year || (resource.type === "mepedia" ? "2020" : undefined)}
              </Typography>
            </Grid>
            }
        </CardContent>
    </Card>;
}
