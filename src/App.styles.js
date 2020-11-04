import { createStyles, makeStyles } from "@material-ui/core/styles";

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
        }
    }),
);