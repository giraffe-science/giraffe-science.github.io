import {makeStyles, Theme as DefaultTheme} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";

export type CustomClass =
    "appBar"
    | "content"
    | "contentText"
    | "h1Giraffe"
    | "h1Scientific"
    | "resourceCard"
    | "resourceCardContent"
    | "resourceCardActions"
    | "resourceLink"
    | "resourceTitle"
    | "resourceType"
    | "resourceDate";
export const useClasses: (props?: any) => ClassNameMap<CustomClass> = makeStyles<DefaultTheme, CustomClass>((theme => (
    {
        appBar: {
            color: "#222",
            backgroundColor: "#fff",
            boxShadow: "none"
        },
        content: {
            maxWidth: "750px"
        },
        contentText: {
            marginTop:"20px"
        },
        h1Scientific: {
            fontSize: 31.5,
            letterSpacing: 3,
            lineHeight: 0.75,
        },
        h1Giraffe: {
            fontSize: 44,
            letterSpacing: 3,
            lineHeight: 0.75,
        },
        resourceCard: {
            boxShadow: "none",
            height: "100%",
        },
        resourceCardContent: {
            textAlign: "left",
            padding: "0"
        },
        resourceCardActions: {
            padding: "15px 0 0 0",
        },
        resourceLink: {
            textDecoration: "none",
            color: theme.palette.text.primary,
            fontWeight: "bold",
            "&:hover": {
                color: theme.palette.primary.main
            }
        },
        resourceType: {
            fontSize: 14,
            textAlign: "left",
            fontWeight: "bold"
        },
        resourceDate: {
            fontSize: 14,
            textAlign: "left",
            fontWeight: "normal"
        },
        resourceTitle: {
            fontSize: 18,
            textAlign: "left",
            paddingBottom: "10px"
        }
    }
)));
const baseTheme = createMuiTheme({
    typography: {
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        h1: {
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            color:"#1a1a1a",
        },
        h2: {
            fontSize: 18,
            color:"#1a1a1a",
        },
        body1 :{
            color: "#323232",
        },
        body2 :{
            color: "#656565",
        }
    },
    palette: {
        background: {
            default: "#fff"
        },
        primary: {
            main: "#B06B32"
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [],
                a: {
                    textDecoration: "none",
                    color: "rgba(0,0,0,0.87)"
                }
            },
        }
    },
});
export const theme = responsiveFontSizes(baseTheme);