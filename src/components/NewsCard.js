/* import React from 'react';

function NewsCard(props) {
    return (
        <div className={"card text-dark m-2 " + props.additionClass}
            style={{width: props.width}}>
            <img className="card-img-top"       
                src={props.urlToImage}
                alt="Card image cap"
            />
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text">{props.description}</p>
                <button
                onClick = {props.click}
                className="btn btn-primary">Read More</button>
            </div>
        </div>
    )
}

export default NewsCard */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function NewsCard(props) {
    const classes = useStyles();
    console.log(1,props.data)
    const listItems = props.data.map(item=>{
        return(
            <div>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={item.urlToImage} />
                    </ListItemAvatar>
                    <ListItemText
                    primary={item.title}
                    secondary={
                        <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                        >
                            <br/>- {item.source.name} -<br/>
                        </Typography>
                         <br/> {item.description}
                        </React.Fragment>
                    }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        )
    });
    //console.log(listItems);
    return (
    <List className={classes.root}>
        {listItems}
    </List>
    );
}
