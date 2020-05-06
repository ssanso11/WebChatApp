import React from 'react';
import '../styles/FindTeacher.css'
import { Button, Select, Input, Card } from 'semantic-ui-react'
import dummyImage from '../images/music-teacher.jpg';

export default class FindTeacher extends React.Component {
    render() {
        return (
            <div className="find-teacher-container">
                <div className="find-teacher-header">
                    <h1 className="find-text">Find a Teacher</h1>
                    <div className="search-bar">
                        <Input fluid icon='search' type='text' placeholder='Search...' action>
                            <input />
                            <Select options={instruments} placeholder="Instrument" defaultValue='default' />
                            <Button type='submit' size="medium" style={{color:"white", backgroundColor: "#6470FF",}}>Search</Button>
                        </Input>
                    </div>
                </div>
                <div className="search-results-container">
                    <p>24 Teachers matching your search results</p>
                    <div className="teacher-results-grid">
                        <Card style={{"text-align": "center", "margin": "0 auto", "width": "85%"}}>
                            <h1 style={{color: "#6470FF"}}>Clarinet</h1>
                            <div className="card-profile" style={{display:"flex", margin: "0 auto"}}>
                                <img src={dummyImage} className="teacher-image"/>
                                <p className="teacher-name">Jeff Daves</p>
                            </div>
                            <hr style={{"width": "50%", margin: "0 auto", "marginTop": "15px", color: "#707070"}}/>
                            <h2 style={{"margin-top": "10px", "fontSize": "24px", "color": "#6470FF", "fontWeight": "bolder"}}>Next lesson</h2>
                            <div className="next-lesson-div">
                                <p style={{"fontSize": "18px", "color": "black", }}>12 July 2020</p>
                            </div>
                            <div className="view-homework-div">
                                <p style={{"fontSize": "18px", "margin": "0 auto"}}>View Homework</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

        );
    }
}

const instruments = [
    {key:"default", text: "Instrument", value: "default"},
	{key:"accordion", text: "Accordion", value: "accordion"},
	{key:"bagpipe", text: "Bagpipe", value: "bagpipe"},
	{key:"banjo", text: "Banjo", value: "banjo"},
	{key:"bass guitar", text: "Bass Guitar", value: "bass guitar"},
	{key:"bassoon", text: "Bassoon", value: "bassoon"},
	{key:"bugle", text: "Bugle", value: "bugle"},
	{key:"cello", text: "Cello", value: "cello"},
	{key:"clarinet", text: "Clarinet", value: "clarinet"},
	{key:"flute", text: "Flute", value: "flute"},
	{key:"French horn", text: "French Horn", value: "French horn"},
	{key:"guitar", text: "Guitar", value: "guitar"},
	{key:"harp", text: "Harp", value: "harp"},
	{key:"mandolin", text: "Mandolin", value: "mandolin"},
	{key:"oboe", text: "Oboe", value: "oboe"},
	{key:"percussion", text: "Percussion", value: "percussion"},
	{key:"piano", text: "Piano", value: "piano"},
	{key:"organ", text: "Organ", value: "organ"},
	{key:"saxophone", text: "Saxophone", value: "saxophone"},
	{key:"trombone", text: "accordion", value: "accordion"},
	{key:"tuba", text: "Tuba", value: "tuba"},
	{key:"ukulele", text: "Ukulele", value: "ukulele"},
	{key:"viola", text: "Viola", value: "viola"},
	{key:"violin", text: "Violin", value: "violin"},
]