import { createStyles, makeStyles } from "@material-ui/core/styles";
const drawerWidth = 240;

export const useStyles = makeStyles((theme) =>
    createStyles({
        menuLink: {
            marginRight: theme.spacing(2),
            color: theme.palette.common.white
        },
        lastMenuLink: {
            flexGrow: 1,
            marginRight: theme.spacing(2),
            color: theme.palette.common.white
        },
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        button: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);