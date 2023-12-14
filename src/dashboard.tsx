// import React, { useState } from 'react';

// import { Text, Container, Divider, Grid, Tabs, Select } from '@mantine/core';
import Navbar from "./components/navbar";

// import styles from "./components/styles.module.css";

export default function Dashboard() {

    // const [activeTab, setActiveTab] = useState("Overview");

    // const handleSelectChange = (value: string) => {
    //     setActiveTab(value);
    // };

    return (
        <body style={{
            display: "flex",
        }}>
            {/* navbar */}
            <Navbar />
dfdfd
            {/* <Grid w="100%" p="xl">
                <Grid.Col span={12}>
                    <Text c="redcolor.4" fw={500} size="topic">
                        Dashboard
                    </Text>

                    <Select
                        data={["Overview", "Event Manager", "Presenter"]}
                        value={activeTab}
                        onChange={handleSelectChange}
                        className={styles.dropdown}

                    />
                </Grid.Col>
                <Grid.Col span={12}>
                   
                    {activeTab === "Overview" && <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas ad nisi sed distinctio laborum animi maiores inventore a soluta repellat, at voluptatibus nesciunt, fuga blanditiis qui consequatur earum numquam labore.</div>}
                    {activeTab === "Event Manager" && <div>Messages Content for Select</div>}
                    {activeTab === "Presenter" && <div>Settings Content for Select</div>}
                </Grid.Col>
            </Grid> */}
        </body>
    );

}