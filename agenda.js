(function(){
    /* UI */
    var ui={
        fields:document.querySelectorAll("input"),
        button:document.querySelector(".pure-button"),
        table:document.querySelector(".pure-table tbody")
    };
    /* console.log(ui); */

    /* ACTIONS */
    var validadeFields=function(e){
        e.preventDefault();
        console.log("Botão funcionando...");
        
        var errors=0;
        var data={};

        ui.fields.forEach(function(field){
            if(field.value.trim().length<2){
                field.classList.add("error");
                errors++;
            }else{
                field.classList.remove("error");
                data[field.id]=field.value.trim();
            }
        })

        console.log("Erros:",errors,"Dados",data);

        if(errors===0){
            addContact(data);
        }else{
            document.querySelector(".error").focus();
        }

    };

    var addContact=function(data){
        console.log("Salvando contato...")
        console.log(data);
        console.log(JSON.stringify(data));

        var endpoint="http://localhost:8000/contacts";
        var conf={
            method:"POST",
            body:JSON.stringify(data),
            headers:new Headers({
                "Content-type":"application/json"
            })
        };

        fetch(endpoint,conf)
        .then(getContacts)
        .catch(genericError);
    };

    var genericError=function(){
        console.log("Falha em salvar dados")
    };

    var getContacts=function(){
        console.log("Listando contatos...");
        var endpoint="http://localhost:8000/contacts";
        var conf={
            method:"GET",
            headers:new Headers({
                "Content-type":"application/json"
            })
        };

        fetch(endpoint,conf)
        .then(function(resp){
            return resp.json();
        })
        .then(getContactsSuccess)
        .catch(genericError);
    };

    var getContactsSuccess=function(contacts){
        /* console.log(contacts); */
        var html=[];
        contacts.forEach(function(contact,index){
            html.push(`
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td><a href="#" data-item-id="${contact.id}" data-item-action="remove">Excluir</a></td>
                </tr>
            `)
        });
        ui.table.innerHTML=html.join("");
    }

    var removeContact=function(e){
        event.preventDefault();
        var dataset = e.target.dataset;
        if(dataset.itemAction=="remove" && confirm("Deseja excluir este item?")){
            var endpoint=`http://localhost:8000/contacts/${dataset.itemId}`;
            var conf={
                method:"DELETE",
                headers:new Headers({
                    "Content-type":"application/json"
                })
            }
            fetch(endpoint,conf)
            .then(getContacts)
            .catch(genericError)
        }
    };

    var init=function(){
        console.log("Starting app...");
        getContacts();
        /* mapping events */
        ui.button.onclick=validadeFields;
        ui.table.addEventListener("click",removeContact);
    }();

})();

function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}
function mtel(v) {
    v = v.replace(/\D/g, "");    //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");    //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}
function id(el) {
    return document.getElementById(el);
}
window.onload = function () {
    id('phone').onkeypress = function () {
        mascara(this, mtel);
    }
}


