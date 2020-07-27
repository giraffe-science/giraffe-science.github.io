import {Card} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import React, {useState} from 'react';
import './App.css';
import {Library, Resource} from "./Library";
import {ResourceCard} from "./ResourceCard";
import {theme, useClasses} from "./styles";

function hasTag(resource: Resource, tags: Set<string>): boolean {
    for (const tag of resource.tags) {
        if (tags.has(tag)) return true;
    }
    return false;
}

function App({loading}: { loading: Promise<Library> }) {
    const classes = useClasses();
    const [error, setError] = useState<any>();
    const [library, setLibrary] = useState<Library>();
    const [tags, setTags] = useState<Set<string>>(new Set());

    loading
        .then(library => setLibrary(library))
        .catch(setError);

    if (error)
        console.log(error);

    function toggleTag(tag: string) {
        const newTags = new Set(tags);
        if (tags.has(tag))
            newTags.delete(tag)
        else
            newTags.add(tag);
        setTags(newTags);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div style={{borderBottom: "1px solid #999", marginBottom: "10px"}}>&nbsp;</div>
            <Container className="App">
                <AppBar className={classes.appBar} position="static">
                    <Typography variant="h1" className={classes.h1Scientific}>SCIENTIFIC</Typography>
                    <Typography variant="h1" className={classes.h1Giraffe}>GIRAFFE</Typography>
                </AppBar>
            </Container>
            <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>

            <Container className="App">
                {library
                    ? <Container>
                        {Object.keys(library.tags).map(tag =>
                            <Chip label={tag.toUpperCase()}
                                  key={tag}
                                  clickable
                                  color={tags.has(tag) ? "primary" : "default"}
                                  onClick={() => toggleTag(tag)}
                            />)}
                    </Container>
                    : <p>Loading...</p>
                }
            </Container>
            <div style={{borderTop: "1px solid #999", marginTop: "10px"}}>&nbsp;</div>
            <Container className="App">

                {error && <Card>
                  <CardContent>
                    <p>Error: ${error?.message || "error"}</p>
                  </CardContent>
                </Card>}
                {library
                    ? <Box>
                        <Box>{
                            library.resources.filter(resource => tags.size === 0 ? true : hasTag(resource, tags)).map((resource, i) =>
                                <ResourceCard resource={resource} i={i}/>
                            )
                        }
                        </Box>
                    </Box>
                    : <p>loading...</p>}
            </Container>
        </ThemeProvider>
    );
}

export default App;
