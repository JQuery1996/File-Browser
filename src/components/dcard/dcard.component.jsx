import React from "react";

import "./dcard.styles.css";

import DCardItem from "../dcard-item/dcard-item.component";

import Container from '@mui/material/Container';

function DCard({ applications }) {
    return (
        <Container maxWidth="xl" className="cards">
                    <div className="cards__container">
                        {applications.map((app, idx) => {
                            return (
                                <DCardItem 
                                className="test"
                                key={idx}
                                    src={app.src}
                                    label={app.arName}
                                    path={app.path}
                                    icon={app.icon}
                                />
                            );
                        })}
                    </div>
        </Container>
    );
}

export default DCard;