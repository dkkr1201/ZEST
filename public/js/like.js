const likeBtns = document.querySelectorAll('.product-like-btn');

likeBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('product-id');
        try{
            await axios({
                method:'post',
                url:`/products/${id}/like`,
                headers:{'X-Requested-With':'XMLHttpRequest'}
            });

            window.location.reload();
        }
        catch(e){
            window.location.replace('/login');
        }
    })
})
