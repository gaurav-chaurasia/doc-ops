// handle doc upload
const doc_upload_btn = document.querySelector('.doc-upload-btn');
doc_upload_btn.addEventListener('click', (event) => {
    // event.preventDefault();
    console.log('Doc Uploaded');
});



function highlight_string(input_id, text_id) {
    let html = ``;
    const search_string_text = document.querySelector(input_id).innerHTML;
    let text_string_a = document.getElementById(text_id).innerHTML;
    
    if(search_string_text == '') {
        return;
    }

    let res = text_string_a
        .toLocaleLowerCase()
        .trim()
        .split(search_string_text.toLocaleLowerCase().trim());
    
    for (let i = 0; i < res.length - 1; i++) {
        html += res[i] + ` <code class="alert-danger"><strong> ${search_string_text} </strong></code> `;
    }
    html += res[res.length - 1];
    document.getElementById(text_id).innerHTML = html;
    console.log(search_string_text);
    console.log(text_string_a);
}
highlight_string('#search_query_string code', 'text_1');
highlight_string('#search_query_string code', 'text_2');