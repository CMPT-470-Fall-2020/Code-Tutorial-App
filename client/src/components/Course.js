import React from 'react';

function Course({name, description}) {
    return (
        <div>
            <h1>{name}</h1>
            <h2>{description}</h2>
            <button>This will route to tutorials for {name}</button>
        </div>
    );
}

export default Course;