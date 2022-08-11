function buildTemplate(paramsCollection) {
    let template =[];
    paramsCollection.map( p => {
     let object={};
     if (p.visible == true){
     object.name = p.name;
     object.bind = p.name;
     object.width = '250px';
     object.label = p.text;
     object.align = 'left';
     object.labelWidth = '100px';
     object.labelPosition = 'right';
     object.labelAlign='right';
       if (p.required == false) {object.required = false}
        else {object.required = true}
       if(p.type == 'string')
         {object.type = 'text';}
         else if (p.type == 'int')
         {object.type = 'number';}
         else if (p.type == 'date')
         {object.type = 'date'; }

       if(p.hasOwnProperty('fillFrom'))
        {
          object.type = 'button';
          object.text = p.fillFrom.text;
        }
     }
    template.push(object);
    })
return template;
}
export default buildTemplate;


export function buildValue(paramsCollection){
  let object={};
  paramsCollection.map( p =>
    {
      if(p.hasOwnProperty('fillFrom'))
        object[p.name] = p.fillFrom.displayText;
      else
        object[p.name] = '';
    })
    return object;
}
