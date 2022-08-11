import React from "react";

import { Link } from "react-router-dom";

import './dcard-item.styles.css';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import * as FontAwesome from 'react-icons/fa';
import * as FontAwesome from 'react-icons/fa'
//  BsFillEmojiWinkFill
export default function DCardItem(props) {
    const { icon, src, path, label } = props;
    console.log("props",props);
    return (
      <div className="dcard-item">
      
         
          <Card sx={{ maxWidth: 350 }}>
            <CardActionArea>
              <div className="cards__item">
          
              {(() => {


        switch (label) {
          case "التصنيف الضريبي":   return   <CardMedia
             component="img"
            height="150"
            style={{opacity:"0.8"}}
            image={`${process.env.PUBLIC_URL}/images/Tasnif.jpg`}
             alt="syria"
           />;
          // <FontAwesome.FaRegMoneyBillAlt style={{fontSize: "50px"}}/>; 

        // 
          case "ادارة الصلاحيات": return <CardMedia
          component="img"
          height="150"
          style={{opacity:"0.6"}}
          image={`${process.env.PUBLIC_URL}/images/Capture.PNG`}
          alt="syria"
        />;
           case "ادارة المراقبة":  return <CardMedia
           component="img"
           height="150"
           style={{opacity:"0.8"}}
           image={`${process.env.PUBLIC_URL}/images/ccc.jpg`}
           alt="syria"
         />;
         case " اعدادات النظام":  return <CardMedia
           component="img"
           height="150"
           style={{opacity:"0.8"}}
           image={`${process.env.PUBLIC_URL}/images/system.jpg`}
           alt="syria"
         />;
         
         
      //    case "التقارير":  return <CardMedia
      //    component="img"
      //    height="150"
      //    image={`${process.env.PUBLIC_URL}/images/Report.jpg`}
      //    alt="syria"
      //  />;
         default:      return <CardMedia
         component="img"
         height="150"
         style={{opacity:"0.6"}}
         image={`${process.env.PUBLIC_URL}/images/Report.jpg`}
         alt="syria"
       />;;
        }
      })()}



     {/* <CardMedia
     component="img"
     height="150"
     image={`${process.env.PUBLIC_URL}/images/syria2.PNG`}
     alt="syria"
   />
   */}

           
              </div>
              <CardContent >
                <Typography gutterBottom variant="h6" component="div" >
                  {/* icon={icon} */}
                  {/* <img src={`${process.env.PUBLIC_URL}/images/new messege.png`}  width="10%" height="15%" /><br/> */}
                 {/* <FontAwesome icon={}/> */}
                 <Link to={path}>
                  <a style={{ textDecoration: 'none'}}>{label}</a>
        </Link>

                </Typography>
                <Typography variant="body2" color="text.secondary">

                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
    );
  }