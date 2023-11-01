# Clerk Standard Designs

# Table of Contents
1. [Clerk Standard Designs](#clerk-standard-designs)
2. [Facets](#facets)
    - [Top Facets](#top-facets)
    - [Side Facets](#side-facets)
3. [Recs](#recs)
    - [Side Cart](#side-cart)
        - [Design](#design)
        - [Installing the Sidecart](#installing-the-sidecart)
    - [Standard Skeleton](#standard-skeleton)
4. [Search](#search)
    - [Live Search](#live-search)
        - [Full Width](#full-width)
            - [Grid](#grid)
            - [List](#list)
        - [Block](#block)
            - [Grid](#grid-1)
            - [List](#list-1)
    - [Search Page](#search-page)
## Facets 
### Top facets
##### HTML
```html
<div class="clerk-facets-wrapper">
    <div class="clerk-facets">
            {% assign fcount = facets.length %}
            {% assign index = 0 %}
            {% for facet_group in facets %}
    
                <div class="clerk-facet-group clerk-facet-{{ facet_group.group }} actual_facet tag">
                    <div class="clerk_facet_title clerk_down_arrow" onclick="facet_toggle(this)">{{ facet_group.title }}</div>
                    <div class="facet_wrap">
                    {% if facet_group.type == "range" %}
                        <div class="clerk-range stagio_range" 
                        data-group="{{ facet_group.group}}"
                        data-min="{{ facet_group.min }}" 
                        data-max="{{ facet_group.max }}" 
                        data-start="{{ facet_group.start }}" 
                        data-end="{{ facet_group.end }}" 
                        data-step="auto"></div>
                    {% endif %}
    
                    {% if facet_group.facets.length > 10 %}
                        <input type="text" 
                        placeholder="{{translation.search_for}} {{ facet_group.title }}..." 
                        class="clerk-facet-search" />
                    {% endif %}
    
                        <div class="clerk-facet-group-facets {% if facet_group.facets.length > 10 %} pad-left {% endif %}">
                            {% for facet in facet_group.facets %}
                                <div class="clerk-facet 
                                {% if facet.selected %}
                                clerk-facet-selected
                                {% endif %}" 
                                data-facet="{{ facet_group.group }}" 
                                data-value="{{ facet.value }}" 
                                data-min="{{ facet.min }}" 
                                data-max="{{ facet.max }}">
                                    <div class="clerk-facet-count">
                                    {{ facet.count }}
                                    </div>
                                    <div class="clerk-facet-name">
                                    {{ facet.name }}
                                    </div>
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
                {% assign index = index + 1 %}
            {% endfor %}
            {% if fcount > 5 %}
                <div class="clerk-facet-group fake_facet">
                    <div class="clerk_facet_title" onclick="facet_count_toggle(this)">Filtri ({{ fcount }})</div>
                </div>
            {% endif %}
    
        </div>
        <select class="clerk_sort_select" onchange="clerkSorting(this.options[this.selectedIndex].value, event);">
            <option value="" disabled selected>Ordina per:</option>
            <option value="null_null">Migliori vendite</option>
            <option value="asc_name">Nome (A - Z)</option>
            <option value="desc_name">Nome (Z - A)</option>
            <option value="asc_price">Prezzo (basso - alto)</option>
            <option value="desc_price">Prezzo (alto - basso)</option>
            <option value="asc_age">Più recenti</option>
            <option value="desc_age">Più vecchi</option>
        </select>
    </div>
    <!--IMPORTANT: CHANGE THE toggle_ui_msg = {show: 'Se filtre', hide: 'Skjul filtre'}; to show other texts to show/hide filters-->
        <script>
        (function(){
        mark_facets = (window.tagged > 0) ? true : false;
        actual_facet = document.querySelectorAll('.actual_facet');
        actual_facet.forEach(af=>{
            if(mark_facets){
                af.classList.toggle('tag');
            }
            let c = 0,
                x = 0,
                t = af.parentNode;
                c = af.querySelectorAll('.clerk-facet-selected').length;
                if(c != 0){
                    if(c > x){
                        x = c;
                        t.prepend(af);
                    }
                    text_label = af.querySelector('.clerk_facet_title').textContent;
                    selected_count = ` (${c})`;
                    af.querySelector('.clerk_facet_title').textContent = text_label + selected_count;
                }
        });
    })();
    
    
    function facet_toggle(){
        el = event.target;
        if(el.closest('.clerk-facet-group').classList.contains('zindex')){
            el.closest('.clerk-facet-group').querySelector('.facet_wrap').style.display = 'none';
            el.closest('.clerk-facet-group').classList.remove('zindex');
            el.classList.remove('zindex');
        } else {
            document.querySelectorAll('.clerk-facet-group').forEach(facet_group=>{facet_group.classList.remove('zindex');});
            document.querySelectorAll('.facet_wrap').forEach(facet_wrap=>{facet_wrap.style.display = 'none';});
            el.closest('.clerk-facet-group').querySelector('.facet_wrap').style.display = 'block';
            el.closest('.clerk-facet-group').classList.add('zindex');
            el.classList.add('zindex');
        }
    }
    
    function facet_count_toggle(){
        toggle_ui_msg = {show: 'Filtri', hide: 'Nascondi filtri'};
        group_count = ` (${document.querySelectorAll('.clerk-facet-group').length})`;
        el = event.target;
        actual_facet = document.querySelectorAll('.actual_facet');
        actual_facet.forEach(facet=>{facet.classList.toggle('tag');});
        el.textContent = (el.textContent.indexOf(toggle_ui_msg['show']) > -1) ?toggle_ui_msg['hide']+group_count : toggle_ui_msg['show']+group_count;
        window.tagged = (window.tagged == undefined ) ? 1 : window.tagged*-1;
    }
    
        // Function to toggle sorting of results based on option in .clerk_sort_select.
        // The function takes the value of the option and splits it by _.
        // The value should always be either asc or desc followed by _ and the attribute key.
        // The only exception to this is the default sorting which is defined as null_null.
        function clerkSorting(val, event) {
            or = (val.split('_')[0] == 'null') ? eval(val.split('_')[0]) : val.split('_')[0];
            orb = (val.split('_')[1] == 'null') ? eval(val.split('_')[1]) : val.split('_')[1];
            param_sort = val;
            Clerk('content', '[data-target][data-query][data-template][data-clerk-content-id]', 'param', {
                orderby: orb,
                order: or
            });
        }
        // Change value in select element to currently active choice, since element rerenders upon initial user input.
        // Without it will show the first option nominally regardless of the current ordering in effect.
        if (!param_sort) {
            var param_sort;
        } else {
            if (param_sort.length > 0) {
                document.querySelector('.clerk_sort_select').value = param_sort;
            }
        }
    </script>
```

##### CSS
```css
#clerk-search-filters {
    margin-bottom: 1em;
}

#clerk-facet-mobile-toggle {
    display: none;
}

.clerk_facet_title {
    text-align: start;
}

.clerk_sort_select:focus-visible {
    outline: none;
}

.clerk_sort_select option {
    border: 1px solid #eee;
    border-radius: 0;
}

.clerk_sort_select:focus {
    border: none;
    border-top: 1px solid #eee;
}

.clerk-range-label-left,
.clerk-range-label-right {
    background-color: unset !important;
    box-shadow: unset !important;
    color: black;
}

@media screen and (min-width: 1001px) {
    .clerk_sort_wrap1 {
        margin-left: auto;
    }
}

.clerk_sort_wrapper select {
    background-image: unset;
}

.clerk_down_arrow:before {
    position: absolute;
    content: "";
    top: 55%;
    right: 22px;
    width: 8px;
    height: 8px;
    text-align: center;
    border: 1px solid #333;
    border-width: 0 2px 2px 0;
    font-size: 10px;
    color: #dcdde0;
    transform: translateY(calc(-50% - 5px)) rotate(45deg);
    transition: 0.3s ease-in-out;
    font-size: 18px;
    z-index: 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.col-left.sidebar h2 {
    display: none;
}

.clerk_facet_title,
.clerk_sort_select {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
    font-size: 14px;
    color: #141414;
    line-height: 1.75em;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0;
    text-rendering: optimizeSpeed;
    user-select: none;
    padding: 15px;
    position: relative;
    background-color: #fff !important;
    display: block;
    text-transform: uppercase;
}

.clerk-range {
    position: relative;
    width: calc(100% - 30px) !important;
    height: 2.5em;
    padding-top: 1.5em;
    margin: 0 15px !important;
}

.facet_wrap {
    display: none;
    position: absolute;
    background: #fff;
    width: calc(100% - 10px);
    margin: 0 0px;
    padding: 5px;
    border-top: none;
    box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
    -webkit-box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
    -moz-box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
}

.col-left.sidebar {
    order: 1;
}

.col2-left-layout .col-main {
    float: unset !important;
    width: 100% !important;
}

.col-left {
    float: unset !important;
    width: 100% !important;
    padding-left: 0;
    clear: unset !important;
}

.main {
    display: flex;
    flex-direction: column;
}

.col-main {
    order: 2;
}

.breadcrumbs {
    /* order: -1; */
    flex: 1;
}

.clerk-facets {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

@media screen and (min-width: 1001px) {
    .clerk-facets {
        column-gap: 1em;
    }
}

.zindex {
    z-index: 100 !important;
}

.products-grid {
    margin: 0px !important;
}

.clerk-range-selected-range {
    background-color: #77807f !important;
}

.page-title {
    display: none;
}

.clerk-facet-group {
    margin-bottom: 0px;
    padding: 0px;
    border-radius: 0px;
    box-shadow: none;
    flex: 0 0 17%;
    max-width: 17%;
    position: relative;
    z-index: 99;
    border-right: none;
}

@media screen and (max-width: 600px) {
    .clerk-facet-group {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
@media screen and (min-width: 601px) and (max-width: 1000px) {
    .clerk-facet-group {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
.clerk-facet-group-title {
    margin-bottom: 1em;

    text-transform: uppercase;
    font-size: 0.8em;
    font-weight: bold;
    letter-spacing: 1px;
    color: #95a5a6;
}

.clerk-facet-group-facets {
    overflow: hidden;
    max-height: 24.5em;
    transition: max-height 0.2s ease-in-out;
}

.clerk-facet-search {
    width: calc(100% - 0em);
    border: 1px solid #888;
    color: black;
    margin: 0 0 1em 0;
    padding: 0.6em 0.8em;
    font-size: 0.9em;
}

input.clerk-facet-show-more {
    display: none;
}

label.clerk-facet-show-more {
    display: block;
    padding-top: 0.5em;
    text-align: center;
    font-size: 0.9em;
    color: #95a5a6;
    cursor: pointer;
}

input.clerk-facet-show-more:checked + .clerk-facet-group-facets {
    max-height: 9001em;
}

input.clerk-facet-show-more:checked + .clerk-facet-group-facets + label.clerk-facet-show-more {
    display: none;
}

.clerk-facet {
    clear: both;
    margin: 0.4em 0;
    cursor: pointer;
    font-size: 12px;
}
.clerk-facet.hidden {
    display: none;
}

.clerk-facet-name {
    overflow: hidden;
    height: 1.8em;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    color: black;
    text-align: start;
}

.clerk-facet-name:before {
    position: relative;
    top: 0.2em;
    display: inline-block;
    content: "";
    width: 1em;
    height: 1em;
    margin: 0 0.5em 0 0;
    border: 1px solid #000;
    border-radius: 0px;
    transition: all 0.1s ease-in-out;
}

.clerk-facet-name:hover:before {
    background-color: #888;
    border-color: #000;
    opacity: 0.8;
}

.clerk-facet-count {
    float: right;
    padding-top: 0.2em;
    font-size: 0.9em;
    color: #95a5a6;
}

.clerk-facet-selected {
    font-weight: bold;
}

.clerk-facet-selected .clerk-facet-name:before {
    background-color: #ccc;
    border-color: #000;
}
/* width */
.clerk-facet-group-facets {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.pad-left {
    padding-right: 10px;
}

.fake_facet .clerk_facet_title {
    background: #eee;
}

/* width */
.clerk-facet-group-facets::-webkit-scrollbar {
    width: 5px;
}

/* Track */
.clerk-facet-group-facets::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
.clerk-facet-group-facets::-webkit-scrollbar-thumb {
    background: #ccc;
    opacity: 0.5;
}

/* Handle on hover */
.clerk-facet-group-facets::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
.clerk-facet-group-facets {
    overflow-y: scroll;
    overflow-y: overlay !important;
}

.tag:nth-child(n + 5) {
    display: none;
}

@media screen and (max-width: 800px) {
    .tag:nth-child(n + 2) {
        display: none;
    }
}

.clerk-facets-wrapper {
    display: flex;
    flex-direction: row;
}

```
### Side facets
##### HTML
```html
<div class="clerk-facets">
    <div class="clerk_absolute">
        <div class="clerk_sort_wrapper">
            <select class="clerk_sort_select" onchange="clerkSorting(this.options[ this.selectedIndex ].value, event);">
                <option value="" disabled selected>Sorter efter:</option>
                <option value="null_null">Bedst sælgende</option>
                <option value="asc_name">Navn (A - Z)</option>
                <option value="desc_name">Navn (Z - A)</option>
                <option value="asc_price">Pris (lav til høj)</option>
                <option value="desc_price">Pris (høj til lav)</option>
            </select>
        </div>
    </div>
    {% assign fcount = facets.length %} {% assign index = 0 %} {% for facet_group in facets %}
    <div class="clerk-facet-group clerk-facet-{{ facet_group.group }} tag">
        <div class="clerk_facet_title" onclick="facet_toggle(this)">{{ facet_group.title }}</div>
        <div class="facet_wrap">
            {% if facet_group.type == "range" %}
            <div class="clerk-range stagio_range" data-group="{{ facet_group.group}}" data-min="{{ facet_group.min }}" data-max="{{ facet_group.max }}" data-start="{{ facet_group.start }}" data-end="{{ facet_group.end }}" data-step="auto"></div>
            {% endif %}

            <div class="clerk-facet-group-facets {% if facet_group.facets.length > 10 %} pad-left {% endif %}">
                {% for facet in facet_group.facets %}
                <div class="clerk-facet {% if facet.selected %} clerk-facet-selected {% endif %}" data-facet="{{ facet_group.group }}" data-value="{{ facet.value }}" data-min="{{ facet.min }}" data-max="{{ facet.max }}">
                    {%comment%}
                    <div class="clerk-facet-count">{{ facet.count }}</div>
                    {%endcomment%}
                    <div class="clerk-facet-name">{{ facet.name }}</div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>

    {% assign index = index + 1 %} {% endfor %} {%comment%} {% if fcount > 3%}
    <div class="clerk-facet-group fake_facet">
        <div class="clerk_facet_title" onclick="facet_count_toggle(this)">See all filters ({{ fcount }})</div>
    </div>
    {%endif%} {%endcomment%}
</div>

<!--IMPORTANT: CHANGE THE toggle_ui_msg = {show: 'Se filtre', hide: 'Skjul filtre'}; to show other texts to show/hide filters-->

<script>
    if (window.innerWidth <= 767) {
        (function () {
            mark_facets = window.tagged > 0 ? true : false;
            actual_facet = document.querySelectorAll(".actual_facet");
            actual_facet.forEach((af) => {
                if (mark_facets) {
                    af.classList.toggle("tag");
                }
                let c = 0,
                    x = 0,
                    t = af.parentNode;
                c = af.querySelectorAll(".clerk-facet-selected").length;
                if (c != 0) {
                    if (c > x) {
                        x = c;
                        t.prepend(af);
                    }
                    text_label = af.querySelector(".clerk_facet_title").textContent;
                    selected_count = ` (${c})`;
                    af.querySelector(".clerk_facet_title").textContent = text_label + selected_count;
                }
            });
        })();

        function facet_toggle() {
            el = event.target;
            if (el.closest(".clerk-facet-group").classList.contains("zindex")) {
                el.closest(".clerk-facet-group").querySelector(".facet_wrap").style.display = "none";
                el.closest(".clerk-facet-group").classList.remove("zindex");
                el.classList.remove("zindex");
            } else {
                document.querySelectorAll(".clerk-facet-group").forEach((facet_group) => {
                    facet_group.classList.remove("zindex");
                });
                document.querySelectorAll(".facet_wrap").forEach((facet_wrap) => {
                    facet_wrap.style.display = "none";
                });
                el.closest(".clerk-facet-group").querySelector(".facet_wrap").style.display = "block";
                el.closest(".clerk-facet-group").classList.add("zindex");
                el.classList.add("zindex");
            }
        }

        function facet_count_toggle() {
            toggle_ui_msg = { show: "Se filtre", hide: "Skjul filtre" };
            group_count = ` (${document.querySelectorAll(".clerk-facet-group").length})`;
            el = event.target;
            actual_facet = document.querySelectorAll(".actual_facet");
            actual_facet.forEach((facet) => {
                facet.classList.toggle("tag");
            });
            el.textContent = el.textContent.indexOf(toggle_ui_msg["show"]) > -1 ? toggle_ui_msg["hide"] + group_count : toggle_ui_msg["show"] + group_count;
            window.tagged = window.tagged == undefined ? 1 : window.tagged * -1;
        }
    }

    // Function to toggle sorting of results based on option in .clerk_sort_select.
    // The function takes the value of the option and splits it by _.
    // The value should always be either asc or desc followed by _ and the attribute key.
    // The only exception to this is the default sorting which is defined as null_null.
    function clerkSorting(val, event) {
        or = val.split("_")[0] == "null" ? eval(val.split("_")[0]) : val.split("_")[0];
        orb = val.split("_")[1] == "null" ? eval(val.split("_")[1]) : val.split("_")[1];
        param_sort = val;
        Clerk("content", "[data-target][data-query][data-template][data-clerk-content-id]", "param", {
            orderby: orb,
            order: or,
        });
    }
    // Change value in select element to currently active choice, since element rerenders upon initial user input.
    // Without it will show the first option nominally regardless of the current ordering in effect.
    if (!param_sort) {
        var param_sort;
    } else {
        if (param_sort.length > 0) {
            document.querySelector(".clerk_sort_select").value = param_sort;
        }
    }
</script>
```
##### CSS 
```css
.sort_wrap_wrapper {
    text-align: left !important;
}

@media only screen and (max-width: 767px) {
    .clerk-facet-group:before {
        content: "";
        position: absolute;
        top: 50%;
        right: 11px;
        width: 8px;
        height: 8px;
        text-align: center;
        border: 1px solid #333;
        border-width: 0 2px 2px 0;
        font-size: 10px;
        color: #e4e4e4;
        transform: translateY(calc(-50% - 5px)) rotate(45deg);
        transition: 0.3s ease-in-out;
        font-size: 18px;
        z-index: 1;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}

@media only screen and (max-width: 767px) {
    .facet_wrap {
        display: none;
        position: absolute !important;
        box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
        -webkit-box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
        -moz-box-shadow: 1px 9px 14px 0px rgba(123, 121, 121, 0.21);
    }

    .clerk_flex_wrap {
        flex-direction: column;
    }

    .clerk-facet-group {
        padding: 0px;
        border-radius: 0px;
        box-shadow: none;
        flex: 0 0 15%;
        position: relative;
        z-index: 1;
        border-right: none;
        margin-bottom: 1em;
    }

    #clerk-search-filters {
        margin: 1em 0;
    }

    #clerk-facets-container {
        margin-left: 10px;
    }
}

@media only screen and (min-width: 768px) {
    .clerk-facet-group.clerk_sort_select:before {
        content: unset !important;
    }
}

.clerk_flex_wrap {
    display: flex;
}

.clerk-facet-search::placeholder {
    color: black;
}

.clerk-range-dot-left,
.clerk-range-dot-right {
    z-index: 1 !important;
    margin-bottom: 10px;
}

#clerk-search-page-wrap {
    flex-direction: row;
}

@media only screen and (max-width: 767px) {
    #clerk-search-page-wrap {
        flex-direction: column;
    }
}

#clerk-search-filters {
    margin-bottom: 1em;
}

.clerk-facet-group {
    margin-bottom: 0px;
    cursor: pointer;
    font-size: 14px;
    color: #e4e4e4;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    padding: 0px !important;
    text-align: center;
    border: none;
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 100%;
    white-space: normal;
}

.clerk_sort_select:focus-visible {
    outline: none;
}

.clerk_sort_select option {
    border: 1px solid #eee;
    border-radius: 0;
}

.clerk_sort_select:focus {
    border: none;
}

.clerk-range-label-left,
.clerk-range-label-right {
    background-color: unset !important;
    box-shadow: unset !important;
    color: black;
}

@media screen and (min-width: 1001px) {
    .clerk_sort_wrap1 {
        margin-left: auto;
    }
}

.clerk_facet_title {
    text-transform: uppercase;
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
    font-family: inherit;
    color: #000;
    font-size: 14px;
    line-height: 1.75em;
    font-weight: 400;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0;
    text-rendering: optimizeSpeed;
    user-select: none;
    position: relative;
    background-color: transparent;
    display: block;
    text-align: start;
}

.clerk-range {
    position: relative;
    width: calc(100% - 30px) !important;
    height: 2.5em;
    padding-top: 1.5em;
    margin: 0 15px !important;
}

.facet_wrap {
    position: relative;
    background: #fff;
    width: calc(100% - 0px);
    margin: 0px;
    border-top: none;
}

.clerk-facets {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.zindex {
    z-index: 5 !important;
}

.clerk-range-selected-range {
    background-color: #000 !important;
    display: block !important;
}

@media screen and (max-width: 600px) {
    .clerk-facet-group {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
@media screen and (min-width: 601px) and (max-width: 1000px) {
    .clerk-facet-group {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
.clerk-facet-group-title {
    margin-bottom: 1em;
    text-transform: uppercase;
    font-size: 0.8em;
    font-weight: bold;
    letter-spacing: 1px;
    color: #95a5a6;
}

.clerk-facet-group-facets {
    overflow: hidden;
    max-height: 24.5em;
    transition: max-height 0.2s ease-in-out;
}

.clerk-facet-search {
    width: calc(100% - 0em);
    border: 1px solid #888;
    color: black;
    margin: 0;
    padding: 0.6em 0.8em;
    font-size: 0.9em;
}

input.clerk-facet-show-more {
    display: none;
}

label.clerk-facet-show-more {
    display: block;
    padding-top: 0.5em;
    text-align: center;
    font-size: 0.9em;
    color: #95a5a6;
    cursor: pointer;
}

input.clerk-facet-show-more:checked + .clerk-facet-group-facets {
    max-height: 9001em;
}

input.clerk-facet-show-more:checked + .clerk-facet-group-facets + label.clerk-facet-show-more {
    display: none;
}

.clerk-facet {
    clear: both;
    margin: 0.4em 0;
    cursor: pointer;
    font-size: 14px;
}
.clerk-facet.hidden {
    display: none;
}

.clerk-facet-name {
    overflow: hidden;
    height: 1.8em;
    font-family: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 89%;
    color: black;
    text-align: start;
    padding-left: 10px;
}

.clerk-facet-name:before {
    position: relative;
    top: 0.2em;
    display: inline-block;
    content: "";
    width: 15px;
    height: 15px;
    margin: 0 0.5em 0 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0px;
    transition: all 0.1s ease-in-out;
}
.clerk-facet-name:hover:before {
    background-color: #888;
    border-color: #000;
    opacity: 0.8;
}

.clerk-facet-count {
    float: right;
    padding-top: 0.2em;
    font-size: 0.9em;
    color: #95a5a6;
}

.clerk-facet-selected {
    font-weight: bold;
}

.clerk-facet-selected .clerk-facet-name:before {
    background-color: #ccc;
    border-color: #000;
}
/* width */
.clerk-facet-group-facets {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.pad-left {
    padding-right: 10px;
}

.fake_facet .clerk_facet_title {
    background: #eee;
}

/* width */
.clerk-facet-group-facets::-webkit-scrollbar {
    width: 5px;
}

/* Track */
.clerk-facet-group-facets::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
.clerk-facet-group-facets::-webkit-scrollbar-thumb {
    background: #ccc;
    opacity: 0.5;
}

/* Handle on hover */
.clerk-facet-group-facets::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

.clerk-facet-group-facets {
    overflow-y: scroll;
    overflow-y: overlay !important;
}

#clerk-facets-container {
    width: 20%;
}

.clerk_absolute {
    max-width: 100%;
    padding: 10px;
    border: 1px solid #000;
    margin-bottom: 23.5px;
}

.clerk_sort_wrapper {
    position: relative;
}

.clerk_sort_wrapper:before {
    content: "";
    position: absolute;
    top: 55%;
    right: 11px;
    width: 8px;
    height: 8px;
    text-align: center;
    border: 1px solid #333;
    border-width: 0 2px 2px 0;
    font-size: 10px;
    color: #e4e4e4;
    transform: translateY(calc(-50% - 5px)) rotate(45deg);
    transition: 0.3s ease-in-out;
    font-size: 18px;
    z-index: 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.clerk_sort_select {
    padding-right: 2em;
    margin-bottom: 0px;
    cursor: pointer;
    text-transform: uppercase;
    color: #000;
    letter-spacing: 1px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: left;
    border: none;
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
}

@media only screen and (max-width: 767px) {
    .clerk_sort_select {
        text-align: left !important;
    }
    #clerk-facets-container {
        width: 100%;
    }
    .clerk_absolute {
        max-width: 100%;
        padding: 0;
        border: 0;
        margin-bottom: 0;
        margin-left: 0;
    }
}
```
## Recs 
### Side cart
#### Design
##### HTML
```html
<div class="clerk-sidebar">
    <div class="clerk-sidebar-title">{{headline}}</div>
    <div class="clerk-sidebar-grid">
        <div class="clerk-sidebar-col">
            <div class="clerk-sidebar-products">
                {% for product in products %}
                <div class="clerk-sidebar-product">
                    <div class="clerk-sidebar-image-wrapper">
                        <a class="clerk_link" href="{{ product.url }}">
                            <div class="clerk_image_wrapper">
                                <img class="clerk_product_image" loading="lazy" src="{{ product.images }}" />
                            </div>
                        </a>
                    </div>
                    <div class="clerk-sidebar-info-wrapper">
                        <div class="clerk-sidebar-product-name">
                            <a href="{{ product.url }}">{{product.name}}</a>
                        </div>
                        <div class="clerk-sidebar-price-wrapper">
                            {% if product.on_sale == true %}
                            <div class="clerk-sidebar-normal-price">
                                <span class="clerk-price">{{ currency_symbol | replace "." "" }} {{ product.list_price | currency_converter | money 2 "." "." }}</span>
                            </div>
                            {% endif %}
                            <div class="clerk-sidebar-on_sale-price">
                                <span class="clerk-price">{{ currency_symbol | replace "." "" }} {{ product.price | currency_converter | money 2 "." "." }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {% endif %} {% endfor %}
            </div>
        </div>
    </div>
</div>
```
##### CSS 
```css
#sidebar-cart {
    max-width: 400px;
    float: right;
}
.Cart.Drawer__Content {
    max-width: 900px;
    float: right;
}

#clerk-powerstep {
    position: absolute;
    top: 100px;
    left: -360px;
}

.drawer {
    overflow: unset !important;
}

.drawer--has-fixed-footer .drawer__inner {
    overflow: inherit !important;
}

.clerk-sidebar-title {
    font-style: normal;
    color: #303030;
    padding: 24px 0px 11px 0px;
    border-bottom: 1px #c9c9c9;
    margin: 0px 30px;
    font-family: inherit;
    margin-bottom: 10px;
    text-align: center;
    text-transform: uppercase;
    margin: 0 auto;
    line-height: normal;
    font-size: 1.41176em;
    font-weight: 400;
    letter-spacing: 1px;
}

.clerk-price-sidebar-wrap {
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
}

.clerk-sidebar-container {
    width: 280px;
}

.clerk-sidebar {
    overflow: hidden;
    width: 280px;
    background-color: #f9f9f9;
    border-top: 0px;
    border: 1px solid lightgray;
    border-top: none;
    border-bottom: none;
    height: 100vh;
}

.clerk-sidebar-no-results {
    padding: 1em;
    font-style: italic;
    text-align: center;
}

.clerk-sidebar-alternate-query {
    padding: 1em;
}

.clerk-sidebar-more-results {
    padding: 1em;
    font-size: 1.2em;
    text-align: center;
}

/* Grid layout */
.clerk-sidebar-grid {
    display: flex;
}

.clerk-sidebar-col:first-child {
    flex: 2;
}

.clerk-sidebar-col:last-child {
    flex: 1;
}

/* width */
.clerk-sidebar-products {
    scrollbar-width: none;
    scrollbar-color: #222 transparent;
}

/* width */
.clerk-sidebar-products::-webkit-scrollbar {
    width: 0px;
}

/* Track */
.clerk-sidebar-products::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
.clerk-sidebar-products::-webkit-scrollbar-thumb {
    background: #222;
    opacity: 0.5;
}

/* Handle on hover */
.clerk-sidebar-products::-webkit-scrollbar-thumb:hover {
    background: #222;
}

/* Products */
.clerk-sidebar-products {
    height: calc(100vh - 80px);
    overflow-y: scroll;
}

.clerk-sidebar-product {
    display: flex;
    flex-direction: column;
    padding: 1em;
}
.clerk-sidebar-product > * {
    flex: 1 1 auto;
}
.clerk-sidebar-product > *:first-child,
.clerk-sidebar-product > *:last-child {
    flex: 0 0 auto;
}

.image-cwrap {
    background: #ffffff;
    height: auto;
}

.clerk-sidebar-product-image {
    width: 100%;
    height: 100%;
    padding: 0.5em;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    object-fit: contain;
}

.clerk-sidebar-product-name {
    font-weight: 400;
    font-style: 11px;
    color: #000000;
    margin-bottom: 1rem;
    font-family: inherit;
    text-transform: normal;
    letter-spacing: 0em;
    font-size: 12px;
    text-align: center;
    max-width: 100%;
    margin-top: 10px;
}

.clerk-sidebar-product-vendor {
    font-weight: 400;
    font-style: normal;
    color: #303030;
    text-transform: uppercase;
    margin-bottom: 0px;
    letter-spacing: 0.2em;
    font-size: 11px;
    text-align: inherit;
    max-width: 100%;
    text-align: inherit;
    margin-top: 0px;
}

.clerk-sidebar-product-list-price {
    opacity: 0.8;
    flex: 1;
    font-size: 11px;
    font-family: inherit;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #000000;
    height: intial;
    text-decoration: line-through;
    font-weight: normal;
    text-align: center;
    max-width: fit-content;
}

.clerk-sidebar-product-price1 {
    flex: 1;
    height: intial;
    font-size: 11px;
    font-family: inherit;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #000000;
    text-align: center;
    margin-left: 9em;
    padding-right: 9em;
    max-width: fit-content;
}

.clerk-sidebar-product-price {
    flex: 1;
    font-size: 11px;
    font-family: inherit;
    font-weight: 700;
    color: #000000;
    letter-spacing: 0.1em;
    height: intial;
    text-align: center;
    letter-spacing: 0em;
    max-width: fit-content;
    padding-right: 5px;
}

.clerk-sidebar-product-button {
    display: block;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    background-color: gray;
    color: white;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

/* Suggestions */
.clerk-sidebar-suggestions {
    margin-bottom: 1em;
}

.clerk-sidebar-suggestion {
    padding: 0.1em;
}

/* Categories */
.clerk-sidebar-categories {
    margin-bottom: 1em;
}

.clerk-sidebar-category {
    padding: 0.1em;
}

/* Pages */
.clerk-sidebar-pages {
    margin-bottom: 1em;
}

.clerk-sidebar-page {
    padding: 0.1em;
}

/* MEDIA QUERY */
@media screen and (max-width: 679px) {
    .clerk-sidebar {
        display: none;
    }
    .Drawer__Content {
        height: calc(100vh - 120px) !important;
    }
    #clerk-powerstep {
        position: inherit !important;
        top: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
    }
    .clerk-sidebar-title {
        border-top: 1px solid lightgray;
        padding: 10px;
    }
    .clerk-sidebar {
        overflow: hidden;
        width: auto;
        background-color: white;
        border-top: 0px;
        border: 1px solid lightgray;
        border-top: none;
        border-bottom: none;
        height: 405px;
    }
    .clerk-sidebar-grid {
        display: flex;
        flex-direction: row;
    }
    .clerk-sidebar-products {
        height: 405px;
        overflow-y: hidden;
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
    }
    .clerk-sidebar-product-image {
        display: inline-block;
        width: 160px;
        height: 225px;
        padding: 0.5em;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
    }
}

.clerk-design-component-8GGlRtRg {
    position: absolute;
    top: 72px;
    left: 15px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #ffffff;
    font-family: inherit;
    font-weight: bold;
    font-style: normal;
    padding: 6px 12px 6px 12px;
    background-color: #000000;
    border-radius: 0px;
}

.clerk-design-component-RWG1PJz9 {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #ffffff;
    font-family: inherit;
    font-weight: bold;
    font-style: normal;
    padding: 5px 10px 5px 10px;
    background-color: #000000;
    border-radius: 0px;
}

.clerk-design-component-oXTgXRoB {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    width: auto;
    height: auto;
    margin: 8px 0px 0px 0px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 0px;
    border-color: #cbd5e1;
    border-radius: 0px;
    padding: 0px 0px 0px 0px;
    word-break: break-word;
    text-decoration: none;
}

.clerk-design-component-oXTgXRoB > * {
    word-break: break-word;
    white-space: normal;
    margin: 0px;
    width: auto;
    text-align: left;
    font-size: 12px;
    font-family: inherit;
    color: #999999;
    font-weight: normal;
    font-style: normal;
    text-transform: uppercase;
}

.clerk-design-component-dqZTWKfb {
    position: relative;
}

.clerk-design-component-bNiSvYoJ {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    width: auto;
    height: auto;
    margin: 8px 0px 0px 0px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 0px;
    border-color: #cbd5e1;
    border-radius: 0px;
    padding: 0px 0px 0px 0px;
    word-break: break-word;
    text-decoration: none;
}
.clerk-design-component-bNiSvYoJ > * {
    word-break: break-word;
    white-space: normal;
    margin: 0px;
    width: auto;
    text-align: left;
    font-size: 12px;
    font-family: inherit;
    color: #999999;
    font-weight: normal;
    font-style: normal;
    text-transform: uppercase;
}

.clerk-design-component-rgYcn7XW {
    box-sizing: border-box;
    background-color: #ffffff;
    border-style: solid;
    border-width: 0px;
    border-color: #cbd5e1;
    border-radius: 0px;
    margin: 0px 0px 0px 0px;
    position: relative;
    overflow: hidden;
    width: auto;
    height: auto;
}
.clerk-design-component-rgYcn7XW > div:first-child {
    box-sizing: border-box;
    padding: 0px 10px 10px 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: start;
    gap: 0px;
}
@media screen and (max-width: 896px) {
    .clerk-design-component-rgYcn7XW > div:first-child {
        box-sizing: border-box;
        padding: 0px 10px 10px 10px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: start;
        align-content: start;
        justify-content: start;
        gap: 10px;
    }
}
@media screen and (max-width: 448px) {
    .clerk-design-component-rgYcn7XW > div:first-child {
        box-sizing: border-box;
        padding: 0px 10px 10px 10px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: start;
        align-content: start;
        justify-content: start;
        gap: 10px;
    }
}

.clerk-design-component-GLcrvxXZ {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    width: 98%;
    height: auto;
    margin: 3px 0px 0px 0px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 0px;
    border-color: #cbd5e1;
    border-radius: 0px;
    padding: 0px 0px 0px 0px;
    word-break: break-word;
    text-decoration: none;
    text-transform: uppercase;
}
.clerk-design-component-GLcrvxXZ > * {
    word-break: break-word;
    white-space: normal;
    margin: 0px;
    width: 98%;
    text-align: center;
    font-size: 14px;
    font-family: inherit;
    color: #000000;
    font-weight: normal;
    font-style: normal;
}

.clerk-design-component-34HLeIjA {
    box-sizing: border-box;
    background-color: #ffffff;
    border-style: solid;
    border-width: 0px;
    border-color: #cbd5e1;
    border-radius: 0px;
    margin: 0px 0px 0px 0px;
    position: relative;
    overflow: hidden;
    width: auto;
    height: auto;
}
.clerk-design-component-34HLeIjA > div:first-child {
    box-sizing: border-box;
    padding: 0px 0px 0px 0px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: center;
    gap: 0px;
}
@media screen and (max-width: 896px) {
    .clerk-design-component-34HLeIjA > div:first-child {
        box-sizing: border-box;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        align-content: center;
        justify-content: start;
        gap: 10px;
    }
}
@media screen and (max-width: 448px) {
    .clerk-design-component-34HLeIjA > div:first-child {
        box-sizing: border-box;
        padding: 0px 0px 0px 0px;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        align-content: center;
        justify-content: start;
        gap: 10px;
    }
}

.clerk-design-component-TXgXe23x {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: flex-start;
    justify-content: flex-start;
    align-items: baseline;
    position: relative;
    width: auto;
    margin: 8px 0px 0px 0px;
    margin-right: 5px;
}
.clerk-design-component-TXgXe23x > .clerk-price {
    font-family: inherit;
    font-size: 14px;
    color: #929292;
    font-weight: normal;
    font-style: normal;
    text-decoration: line-through;
}
.clerk-design-component-TXgXe23x > .clerk-before-price {
    font-family: inherit;
    font-size: 14px;
    color: #929292;
    font-weight: normal;
    font-style: normal;
    text-decoration: line-through;
}
.clerk-design-component-TXgXe23x > .clerk-after-price {
    font-family: inherit;
    font-size: 14px;
    color: #475569;
    font-weight: normal;
    font-style: normal;
}

.clerk-design-component-OVnSr6wy {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: flex-start;
    justify-content: flex-start;
    align-items: baseline;
    position: relative;
    width: auto;
    margin: 8px 0px 0px 0px;
}
.clerk-design-component-OVnSr6wy > .clerk-price {
    font-family: inherit;
    font-size: 14px;
    color: #000000;
    font-weight: normal;
    font-style: normal;
}
.clerk-design-component-OVnSr6wy > .clerk-before-price {
    font-family: inherit;
    font-size: 14px;
    color: #000000;
    font-weight: normal;
    font-style: normal;
}
.clerk-design-component-OVnSr6wy > .clerk-after-price {
    font-family: inherit;
    font-size: 14px;
    color: #475569;
    font-weight: normal;
    font-style: normal;
}

/* MEDIA QUERY */
.cart-sb form {
    height: calc(100vh - 50px) !important;
}

.percentage-text {
    color: #FF0000;
}
```
#### Installing the sidecart
```liquid
<!-- 
Useful for when a side-cart does not get re-rendered, but becomes in\visible.

At the time of writing can be seen live at **“23.01.30 - Clerk.io STOY 2K21 2.0”  @** Stoy.com

When implementing see what classes are being changed, as the script observes attribute changes for <targetNode>.
Transitioning: call cart.js (shopify cart endpoint) and check if the products have changed since last time, If they have call Clerk() with the new products

Open: make the slider visible with “opacity =1”
Close: make the slider invisible with “opacity=0”

Open/Close is done as the slider would flicker due to the re-render
-->

<!-- start Clerk.io E-commerce Personalisation tool - www.clerk.io -->
<span class="clerk_m" style="position: absolute; transform: translate(-280px, 0px); min-height: 290px; opacity: 0" id="cart-others-also-bought" data-template="@cart-others-also-bought-2" data-products="[{% for line_item in cart.items %}{% if forloop.index0 > 0 %}, {% endif %}{{ line_item.product.id }}{% endfor %}]"></span>
<style>
    #cart-others-also-bought {
        transition: opacity 0.5s ease-in-out;
    }
</style>
<script>
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("CartDrawer");
    // Options for the observer (which mutations to observe)
    const config = { attributes: true };

    let cartFetched = false;
    let previousitemsID = [];
    const clerk_element = document.getElementById("cart-others-also-bought");

    // Function to fetch cart data
    async function fetchCartData() {
        const response = await fetch("/cart.js");
        const data = await response.json();
        let itemsID = [];
        let cartItems = data.items;
        for (var i = 0; i < cartItems.length; i++) {
            itemsID.push(cartItems[i].product_id);
        }
        return itemsID;
    }

    // Callback function to execute when mutations are observed
    const callback = async (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes") {
                if (targetNode.className == "drawer drawer--right is-transitioning drawer--is-open" && !cartFetched) {
                    cartFetched = true;
                    try {
                        const itemsID = await fetchCartData();
                        if (JSON.stringify(previousitemsID) != JSON.stringify(itemsID)) {
                            await Clerk("content", ".clerk_m", "param", { products: itemsID });
                            previousitemsID = itemsID;
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        cartFetched = false;
                    }
                }
                if (targetNode.className == "drawer drawer--right drawer--is-open") {
                    clerk_element.style.opacity = 1;
                }
                if (targetNode.className == "drawer drawer--right") {
                    clerk_element.style.opacity = 0;
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
</script>
<!-- end Clerk.io E-commerce Personalisation tool - www.clerk.io -->
```
### Standard skeleton
##### HTML
```html
<div class="clerk-wrapper">
    <div class="clerk-headline-wrapper">
        <h1 class="clerk-headline">{{headline}}</h1>
    </div>
    <div class="clerk-slider-wrapper">
        <div class="clerk-slider">
            <!-- Change this to change the currency symbol -->
            {% for item in products %} {% assign currency_symbol = "€" %}
            <div class="clerk-slider-content">
                <!-- SLIDER CONTENT GOES IN HERE -->
            </div>
            {% endfor %}
        </div>
    </div>
</div>
```
##### CSS
```css
.clerk-wrapper {
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
}

.clerk-product-wrapper:hover {
    text-decoration: none;
}

.clerk-headline-wrapper {
    display: flex;
    display: -webkit-box;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: center;
    position: relative;
    width: auto;
    height: auto;
    margin: 0px 0px 0px 0px;
    box-sizing: border-box;
    border-radius: 0px;
    padding: 0px 0px 0px 0px;
    word-break: break-word;
    text-decoration: none;
}

.clerk-headline {
    font-size: 2em;
}

.clerk-slider {
    overflow: visible;
    white-space: nowrap;
    position: relative;
}

/* 
* This will determine  how many products are being shown in the slider
*/
.clerk-slider-content {
    display: inline-block;
    width: calc(25% - 0px);
}
@media screen and (max-width: 768px) {
    .clerk-slider-content {
        width: calc(50%);
    }
}
@media screen and (max-width: 480px) {
    .clerk-slider-content {
        width: calc(50%);
    }
}

/* This will change the styling of the nav buttons */

.clerk-slider-nav {
    cursor: pointer;
    background: rgba(0, 0, 0, 0);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-image: none !important;
}

.clerk-slider-nav-prev:after {
    content: "";
    width: 12px;
    height: 12px;
    border: solid rgba(0, 0, 0, 1);
    border-width: 0 3px 3px 0;
    transform: rotate(135deg);
    margin-left: 3px;
}

.clerk-slider-nav-next:after {
    content: "";
    width: 12px;
    height: 12px;
    border: solid rgba(0, 0, 0, 1);
    border-width: 0 3px 3px 0;
    transform: rotate(-45deg);
    margin-right: 7px;
}

.clerk-slider-nav-prev {
    top: 50% !important;
    left: 0 !important;
    margin-top: -20px;
}

.clerk-slider-nav-next {
    top: 50% !important;
    right: 0 !important;
    margin-top: -20px;
}

/*********************************************
*
* CUSTOM CSS BELOW HERE 
*
*********************************************/
```

## Search
### Live search
#### Full width
##### Grid
###### HTML
```html
<div class="clerk-instant-search">
    <div class="clerk-instant-search-grid">
        {% if (products.length + categories.length + pages.length) == 0 %}
        <!-- NO RESULTS FALLBACK -->
        <div class="clerk-instant-search-no-results">
            Nothing matched:
            <b>{{ query }}</b>
            ... try a simpler search!
        </div>
        {% endif %} {% if products.length > 0 %}
        <div class="clerk-instant-search-col clerk-col-1">
            <div class="clerk-instant-search-products">
                <div class="clerk-instant-search-title">Products</div>
                <div class="clerk-instant-search-product-grid">
                    {% for product in products %} {% assign currency_symbol = "€" %}
                    <div class="clerk-instant-search-product clerk-instant-search-key-selectable">
                        <!-- PRODUCT INFORMATION -->
                        <a href="{{product.url}}" class="clerk-instant-search-link">
                            <div class="clerk-instant-search-product-image" style="background-image: url('{{ product.image }}');"></div>
                            <div class="clerk-instant-search-product-info">
                                <div class="clerk-instant-search-product-name">{{ product.name | highlight query }}</div>
                                {% if product.variant_prices.first < product.variant_prices.last %} {% if product.price < product.list_price %}
                                <div class="clerk-instant-search-price-wrapper">
                                    <div class="clerk-instant-search-product-list-price">{{ product.list_price | money }} {{ currency_symbol }}</div>
                                    <div class="clerk-instant-search-product-price">{{ product.price | money }} {{ currency_symbol }}</div>
                                </div>
                                {% else %}
                                <div class="clerk-instant-search-price-wrapper">
                                    <div class="clerk-instant-search-product-price">{{ product.price | money }} {{ currency_symbol }}</div>
                                </div>
                                {% endif %} {% else %} {% if product.price < product.list_price %}
                                <div class="clerk-instant-search-price-wrapper">
                                    <div class="clerk-instant-search-product-list-price">{{ product.list_price | money }} {{ currency_symbol }}</div>
                                    <div class="clerk-instant-search-product-price">{{ product.price | money }} {{ currency_symbol }}</div>
                                </div>
                                {% else %}
                                <div class="clerk-instant-search-price-wrapper">
                                    <div class="clerk-instant-search-product-price">{{ product.price | money }} {{ currency_symbol }}</div>
                                </div>
                                {% endif %} {% endif %}
                            </div>
                        </a>
                    </div>
                    {% endfor %}
                </div>
                {% if hits > products.length %}
                <a class="clerk-instant-search-more-results" href="/module/clerk/search?search_query={{ query}}">See more results</a>
                {% endif %}
            </div>
        </div>
        {% endif %} {% if (suggestions.length + categories.length) > 0 %}
        <div class="clerk-instant-search-col clerk-col-2">
            <div class="clerk-instant-search-suggestions">
                {% if suggestions.length > 0 %}
                <div class="clerk_instant_search_suggestions_wrap">
                    <div class="clerk-instant-search-title">Suggestions</div>
                    {% for suggestion in suggestions %} {% if suggestion != query %}
                    <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                        <a class="clerk_instant_search_link" href="/module/clerk/search?search_query={{suggestion}}">{{ suggestion | highlight query }}</a>
                    </div>
                    {% endif %} {% endfor %}
                </div>
                {% endif %}
            </div>
            {% if categories.length > 0 %}
            <div class="clerk-instant-search-categories">
                <div class="clerk-instant-search-title">Categories</div>
                {% for category in categories %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{category.url}}">{{ category.name | highlight query }}</a>
                </div>
                {% endfor %}
            </div>
            {% endif %} {% if pages.length > 0 %}
            <div class="clerk-instant-search-pages">
                <div class="clerk-instant-search-title">Pages</div>
                {% for page in pages %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{ page.url }}">
                        <div class="name">{{ page.title | highlight query 'bold' true }}</div>
                    </a>
                </div>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endif %}
    </div>
</div>

<script>
    // This script ensures that the Instant Search is always placed right under the input field when scrolling and resizing the viewport.
    // If you do not use a sticky header, then this is not necessary.
    // You should also remove .clerk-instant-search-visible { position: fixed !important; } from the the CSS below if this is your use-case.

    if (!clerkFloatingSearchPos) {
        var clerkFloatingSearchPos = true;
        sel = document.querySelector("#{{content.id}}").dataset.instantSearch;
        xVal = document.querySelector(sel).getBoundingClientRect().bottom;
        document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        document.querySelector("#{{content.id}}").style.position = `fixed`;
        window.addEventListener("resize", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        });
        window.addEventListener("scroll", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
            document.querySelector("#{{content.id}}").style.position = `fixed`;
        });
    }
</script>
```
##### CSS
```css
.clerk-instant-search-container {
    left: 0 !important;
}

.clerk-col-1 {
    flex: 1;
}

.clerk-col-2 {
    flex: 2;
}

.clerk-instant-search {
    overflow-y: scroll;
    padding: 20px;
    height: calc(100vh - 7em);
    width: calc(100vw - 1em);
    margin: 0.2em auto;
    background-color: #fff;
    border: 1px solid #eee;
    border-top: 0px;
    border-radius: 5px 5px 10px 10px;
    box-shadow: 0 1em 2em 1em rgba(0, 0, 0, 0.2);
}

.clerk-instant-search-col {
    margin: 0px 0px 20px 0px;
}

.clerk-instant-search-grid {
    display: flex;
}

/******************************************************
*
*  Product
*
********************************************************/

.clerk-instant-search-product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

/******************************************************
*
*  End product
*
********************************************************/

/******************************************************
*
*  Image
*
********************************************************/

.clerk-instant-search-product-image {
    display: inline-block;
    width: 400px;
    height: 480px;
    margin-right: 1rem;
    margin-bottom: 1rem;
    object-fit: cover;
}

/******************************************************
*
*  End image
*
********************************************************/
/******************************************************
*
*  Info wrapper
*
********************************************************/

.clerk-instant-search-product-info {
    display: flex;
    flex-direction: column;
}

/******************************************************
*
*  End Info wrapper
*
********************************************************/
/******************************************************
*
*  Product name
*
********************************************************/

.clerk-instant-search-product-name {
    font-family: Manrope;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #2f314c;
}

.clerk-instant-search-product-name:hover {
    color: #a3aea1;
}

/******************************************************
*
*  End product name
*
********************************************************/
/******************************************************
*
*  Product price
*
********************************************************/

.clerk-instant-search-product-list-price {
    color: #666666;
    font-weight: 600;
    font-size: 13px;
    line-height: 19px;
}

.clerk-instant-search-product-price {
    border-bottom: 2px solid #D3CDC3;
    font-family: 'Manrope';
    font-size: 16px;
    color: #2f314c;
    font-weight: 700;
    line-height: 22px;
    width: fit-content;
}
/******************************************************
*
*  End product price
*
********************************************************/
/******************************************************
*
*  See More button
*
********************************************************/

.clerk-view-more-results-button {
    display: flex;
    justify-content: center;
    color: #6d6d6d;
    text-decoration: underline;
}

.clerk-view-more-results-button:hover {
    text-decoration: none;
    color: #6d6d6d;
}

/******************************************************
*
*  Titles
*
********************************************************/

.clerk-instant-search-title {
    color: #000000;
    margin: 10px 0;
    padding-bottom: 4px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    text-transform: none;
    border-bottom: 2px solid #F4F4F4;
    width: calc(100% - 20px);
}

.clerk-instant-search-category > a {
    color: #000;
    margin: 1px 0;
}

.clerk-instant-search-category > a:hover {
    text-decoration: underline;
    color: #000;
}
```
##### List
```html
<div class="clerk-instant-search">
    <div class="clerk-instant-search-grid">
        {% if products.length > 0 %}
        <div class="clerk-instant-search-col clerk-col-1">
            <div class="clerk-instant-search-products">
                <div class="clerk-instant-search-title">Products</div>
                {% for product in products %} {% assign currency_symbol = "€" %}
                <div class="clerk-instant-search-product clerk-instant-search-key-selectable">
                    <a href="{{product.url}}" class="clerk-instant-search-link">
                        <div class="clerk-instant-search-product-image" style="background-image: url('{{ product.image }}');"></div>
                        <div>
                            <div class="clerk-instant-search-product-brand">{{product.brand}}</div>
                            <div class="clerk-instant-search-product-name">{{ product.name | highlight query }}</div>
                            {% if product.price < product.list_price %}
                            <div class="clerk-instant-search-product-price">{{ currency_symbol }} {{ product.price | money }}</div>
                            <div class="clerk-instant-search-product-list-price">{{ currency_symbol }} {{ product.list_price | money }}</div>
                            {% else %}
                            <div class="clerk-instant-search-product-price">{{ currency_symbol }} {{ product.price | money }}</div>
                            {% endif %}
                        </div>
                    </a>
                </div>
                {% endfor %} {% if hits > products.length %}
                <a class="clerk-instant-search-more-results" href="/module/clerk/search?search_query={{ query}}">See more results</a>
                {% endif %}
            </div>
        </div>
        {% endif %} {% if (suggestions.length + categories.length) > 0 %}
        <div class="clerk-instant-search-col clerk-col-2">
            <div class="clerk-instant-search-suggestions">
                {% if suggestions.length > 1 %}
                <div class="clerk_instant_search_suggestions_wrap">
                    <div class="clerk-instant-search-title">Suggestions</div>
                    {% for suggestion in suggestions %} {% if suggestion != query %}
                    <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                        <a class="clerk_instant_search_link" href="/module/clerk/search?search_query={{suggestion}}">{{ suggestion | highlight query }}</a>
                    </div>
                    {% endif %} {% endfor %}
                </div>
                {% endif %}
            </div>
            {% if categories.length > 0 %}
            <div class="clerk-instant-search-categories">
                <div class="clerk-instant-search-title">Categories</div>
                {% for category in categories %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{category.url}}">{{ category.name | highlight query }}</a>
                </div>
                {% endfor %}
            </div>
            {% endif %} {% if pages.length > 0 %}
            <div class="clerk-instant-search-pages">
                <div class="clerk-instant-search-title">Pages</div>
                {% for page in pages %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{ page.url }}">
                        <div class="name">{{ page.title | highlight query 'bold' true }}</div>
                    </a>
                </div>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endif %}
    </div>
</div>

<script>
    jQuery("#searchbox").each(function () {
        jQuery(this).submit(function (e) {
            e.preventDefault();
            window.location.replace(window.location.origin + "/da/module/clerk/search?search_query={{ query }}");
        });
    });

    // This script ensures that the Instant Search is always placed right under the input field when scrolling and resizing the viewport.
    // If you do not use a sticky header, then this is not necessary.
    // You should also remove .clerk-instant-search-visible { position: fixed !important; } from the the CSS below if this is your use-case.

    if (!clerkFloatingSearchPos) {
        var clerkFloatingSearchPos = true;
        sel = document.querySelector("#{{content.id}}").dataset.instantSearch;
        xVal = document.querySelector(sel).getBoundingClientRect().bottom;
        document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        document.querySelector("#{{content.id}}").style.position = `fixed`;
        window.addEventListener("resize", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        });
        window.addEventListener("scroll", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
            document.querySelector("#{{content.id}}").style.position = `fixed`;
        });
    }
</script>
```
##### CSS
```css
.clerk-instant-search a:hover {
    color: black;
}
@media screen and (min-width: 1200px) {
    .clerk-instant-search-container {
        width: 50%;
        right: 386px !important;
    }
    .clerk-instant-search-products {
        padding-right: 2em;
    }
    .clerk-instant-search-grid {
        display: flex;
    }

    .clerk-col-1 {
        flex: 2;
    }

    .clerk-col-2 {
        flex: 1;
    }

    .clerk-mobile-button {
        display: none;
    }
}

@media screen and (min-width: 768px) and (max-width: 1200px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
    }
    .clerk-mobile-button {
        display: none;
    }
    .clerk-instant-search-button-container {
        display: none;
    }
}
@media screen and (max-width: 767px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
    }
    .clerk-instant-search-grid {
        display: block;
    }

    .clerk-instant-search-button-container {
        display: none;
    }
}

.clerk-instant-search {
    padding: 20px;
}

.clerk-instant-search-container a {
    text-decoration: none !important;
}

.clerk-instant-search {
    overflow: scroll;
    height: calc(100vh - 6em);
    width: 100%;
    min-width: 650px;
    max-width: 1000px;
    margin: 0.2em auto;
    background-color: white;
    border: 1px solid #eee;
    border-top: 0px;
    border-radius: 5px 5px 10px 10px;
    box-shadow: 0 1em 2em 1em rgba(0, 0, 0, 0.2);
}

.clerk-instant-search-no-results {
    padding: 1em;
    font-style: italic;
    text-align: center;
}

.clerk-instant-search-alternate-query {
    margin: 0px 0px 5px 0px;
}

.clerk-instant-search-more-results {
    color: #fff;
    width: 100%;
    display: block;
    padding: 1em;
    background-color: #009dd6;
    font-size: 14px;
    border-radius: 8px;
    text-align: center;
}

.clerk-instant-search-title {
    color: black;
    margin: 0px 0px 5px 0px;
    padding: 0px 0px 10px 0px;
    text-transform: uppercase;
    font-size: 1em;
    font-weight: bold;
    border-bottom: 1px dotted #000000;
    font-family: "Roboto", sans-serif;
}

/* Products */

.clerk-instant-search-product {
    display: flex;
    padding: 0.2em;
    margin: 0px 0px 5px 0px;
    color: #242424;
}

.clerk-instant-search-product:hover .clerk-instant-search-product-name {
    color: black;
}

.clerk-instant-search-product:hover .clerk-instant-search-product-button {
    transform: scale(1.05);
}

.clerk-instant-search-link {
    display: flex;
    flex: 1 1 auto;
}

.clerk-instant-search-link > * {
    flex: 1 1 auto;
}
.clerk-instant-search-link > *:first-child {
    flex: 0 0 auto;
}

.clerk-instant-search-product-image {
    display: inline-block;
    width: 6em;
    height: 6em;
    margin-right: 1em;
    object-fit: cover;
}

.clerk-instant-search-product-name {
    max-height: 3.5em;
    margin: 0em 0em 0.2em 0em;
    padding: 0px 5px 0px 0px;
    overflow: hidden;
    font-weight: 700;
    font-family: "Roboto", sans-serif;
    color: #222222;
}

.clerk-instant-search-product-brand {
    font-size: 0.8em;
    color: #964a44;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
}

.clerk-instant-search-product-list-price {
    display: inline-block;
    margin-right: 0.5em;
    opacity: 0.8;
    font-weight: 700;
    text-decoration: line-through;
    color: #c9c9c9;
    font-family: "Oswald", sans-serif;
}

.clerk-instant-search-product-price {
    display: inline-block;
    font-weight: 700;
    font-family: "Oswald", sans-serif;
    color: #222222;
}

.clerk-instant-search-product-button {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    background-color: #b6c254;
    color: white;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

.clerk-instant-search-product-button-not-in-stock {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    color: black;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

/* Suggestions */

.clerk-icon {
    color: lightgray;
    margin-right: 0.5em;
}

.clerk-instant-search-suggestions {
    margin-bottom: 1em;
}

.clerk-instant-search-suggestion {
    padding: 0.1em;
}

/* Categories */
.clerk-instant-search-categories {
    margin-bottom: 1em;
}

.clerk-instant-search-category {
    padding: 5px;
    margin: 5px;
    width: auto;
    display: inline-block;
    border: 1px solid #617948;
    border-radius: 2px;
    font-weight: bold;
}

.clerk-instant-search-category a {
    color: black;
}

/* Pages */
.clerk-instant-search-pages {
    margin-bottom: 1em;
}

.clerk-instant-search-page {
    padding: 0.1em;
}

@media screen and (min-width: 1200px) {
    .clerk-instant-search-container {
        width: 50%;
        right: 386px;
    }
    .clerk-instant-search-products {
        padding-right: 2em;
    }
    .clerk-instant-search-grid {
        display: flex;
    }

    .clerk-col-1 {
        flex: 2;
    }

    .clerk-col-2 {
        flex: 1;
    }

    .clerk-mobile-button {
        display: none;
    }
}

``` 
#### Block
##### Grid
```html
<div class="clerk-instant-search">
    <div class="clerk-instant-search-grid">
        {% if (products.length + categories.length + pages.length) == 0 %}
        <!-- NO RESULTS FALLBACK -->
        <div class="clerk-instant-search-no-results">
            Nothing matched:
            <b>{{ query }}</b>
            ... try a simpler search!
        </div>
        {% endif %} {% if products.length > 0 %}
        <div class="clerk-instant-search-col clerk-col-1">
            <div class="clerk-instant-search-products">
                <div class="clerk-instant-search-title">Products</div>
                <div class="clerk-instant-search-product-grid">
                    {% for product in products %} {% assign currency_symbol = "€" %}
                    <div class="clerk-instant-search-product clerk-instant-search-key-selectable">
                        <!-- PRODUCT INFORMATION -->
                        <a href="{{product.url}}" class="clerk-instant-search-link">
                            <img class="clerk-instant-search-product-image" src="{{ product.image }}" alt="{{ product.name }}"/> 
                            <div>
                                <div class="clerk-instant-search-product-brand">{{product.brand}}</div>
                                <div class="clerk-instant-search-product-name">{{ product.name | highlight query }}</div>
                                {% if product.price < product.list_price %}
                                <div class="clerk-instant-search-product-price">{{ currency_symbol }} {{ product.price | money }}</div>
                                <div class="clerk-instant-search-product-list-price">{{ currency_symbol }} {{ product.list_price | money }}</div>
                                {% else %}
                                <div class="clerk-instant-search-product-price">{{ currency_symbol }} {{ product.price | money }}</div>
                                {% endif %}
                            </div>
                        </a>
                    </div>
                    {% endfor %}
                </div>
                {% if hits > products.length %}
                <a class="clerk-instant-search-more-results" href="/module/clerk/search?search_query={{ query}}">See more results</a>
                {% endif %}
            </div>
        </div>
        {% endif %} {% if (suggestions.length + categories.length) > 0 %}
        <div class="clerk-instant-search-col clerk-col-2">
            <div class="clerk-instant-search-suggestions">
                {% if suggestions.length > 0 %}
                <div class="clerk_instant_search_suggestions_wrap">
                    <div class="clerk-instant-search-title">Suggestions</div>
                    {% for suggestion in suggestions %} {% if suggestion != query %}
                    <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                        <a class="clerk_instant_search_link" href="/module/clerk/search?search_query={{suggestion}}">{{ suggestion | highlight query }}</a>
                    </div>
                    {% endif %} {% endfor %}
                </div>
                {% endif %}
            </div>
            {% if categories.length > 0 %}
            <div class="clerk-instant-search-categories">
                <div class="clerk-instant-search-title">Categories</div>
                {% for category in categories %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{category.url}}">{{ category.name | highlight query }}</a>
                </div>
                {% endfor %}
            </div>
            {% endif %} {% if pages.length > 0 %}
            <div class="clerk-instant-search-pages">
                <div class="clerk-instant-search-title">Related Content</div>
                {% for page in pages %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{ page.url }}">
                        <div class="name">{{ page.title | highlight query 'bold' true }}</div>
                    </a>
                </div>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endif %}
    </div>
</div>

<script>
    // This script ensures that the Instant Search is always placed right under the input field when scrolling and resizing the viewport.
    // If you do not use a sticky header, then this is not necessary.
    // You should also remove .clerk-instant-search-visible { position: fixed !important; } from the the CSS below if this is your use-case.

    if (!clerkFloatingSearchPos) {
        var clerkFloatingSearchPos = true;
        sel = document.querySelector("#{{content.id}}").dataset.instantSearch;
        xVal = document.querySelector(sel).getBoundingClientRect().bottom;
        document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        document.querySelector("#{{content.id}}").style.position = `fixed`;
        window.addEventListener("resize", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        });
        window.addEventListener("scroll", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
            document.querySelector("#{{content.id}}").style.position = `fixed`;
        });
    }
</script>
```
##### CSS
```css
:root {
    --clerk-primary-color: #4a545b;
    --clerk-secondary-color: #fff;
    --clerk-font-color: #4a545b;
    --clerk-font-family: "Roboto", sans-serif;
}

.ui-autocomplete.ui-front {
    display: none !important;
}

.ac_nov_results {
    display: none !important;
}

.clerk_instant_search_link:hover {
    color: var(--clerk-font-color);
}
.clerk-instant-search {
    padding: 20px;
}

.clerk-instant-search-container a {
    text-decoration: none !important;
}

.clerk-instant-search-col {
    margin: 0px 0px 20px 0px;
}

.clerk-instant-search-product-grid {
    display: grid;
    grid-template-columns: 1fr;
}

.clerk-instant-search {
    overflow-y: scroll;
    height: auto;
    width: 100%;
    min-width: 320px;
    max-width: 1000px;
    margin: 0.2em auto;
    background-color: #fff;
    border: 1px solid #eee;
    border-top: 0px;
    border-radius: 5px 5px 10px 10px;
    box-shadow: 0 1em 2em 1em rgba(0, 0, 0, 0.2);
}

.clerk-instant-search-no-results {
    padding: 1em;
    font-style: italic;
    text-align: center;
    margin: 0 auto;
    color: var(--clerk-font-color);
}

.clerk-instant-search-alternate-query {
    margin: 0px 0px 5px 0px;
}

.clerk-instant-search-more-results {
    padding: 1em;
    background-color: #9fc9eb;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    text-decoration: none;
    border: none;
}

.clerk-instant-search-more-results:hover {
    transition: 0.15s;
    color: var(--clerk-secondary-color);
    background-color: #75b1e2;
    border: none;
    text-decoration: underline;
}

.clerk-instant-search-title {
    color: black;
    margin: 0px 0px 5px 0px;
    padding: 0px 0px 10px 0px;
    text-transform: uppercase;
    font-size: 1em;
    font-weight: bold;
    border-bottom: 1px dotted #4a545b;
    font-family: inherit;
}

/***** Products *****/

.clerk-instant-search-product {
    display: flex;
    padding: 0.2em;
    margin: 0px 0px 5px 0px;
    color: #242424;
}

.clerk-instant-search-product:hover .clerk-instant-search-product-name {
    color: var(--clerk-font-color);
}

.clerk-instant-search-product:hover .clerk-instant-search-product-button {
    transform: scale(1.05);
}

.clerk-instant-search-link {
    display: flex;
    flex: 1 1 auto;
}

.clerk-instant-search-link > * {
    flex: 1 1 auto;
}
.clerk-instant-search-link > *:first-child {
    flex: 0 0 auto;
}

.clerk-instant-search-product-image {
    display: inline-block;
    width: 6em;
    height: 6em;
    margin-right: 1em;
    object-fit: cover;
}

.clerk-instant-search-product-name {
    min-height: 3.5em;
    margin: 0em 0em 0.2em 0em;
    padding: 0px 5px 0px 0px;
    overflow: hidden;
    font-weight: 700;
    font-family: inherit;
    color: var(--clerk-font-color);
}

.clerk-instant-search-product-brand {
    font-size: 0.8em;
    color: var(--clerk-font-color);
    font-weight: bold;
    font-family: inherit;
}

.clerk-instant-search-product-list-price {
    display: inline-block;
    margin-right: 0.5em;
    opacity: 0.8;
    font-weight: 700;
    text-decoration: line-through;
    color: var(--clerk-font-color);
    font-family: inherit;
}

.clerk-instant-search-product-price {
    display: inline-block;
    font-weight: 700;
    font-family: inherit;
    color: var(--clerk-font-color);
}

.clerk-instant-search-product-button {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    background-color: #fff;
    color: white;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

.clerk-instant-search-product-button-not-in-stock {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    color: var(--clerk-font-color);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

/* Suggestions */

.clerk-icon {
    color: lightgray;
    margin-right: 0.5em;
}

.clerk-instant-search-suggestions {
    margin-bottom: 1em;
}

.clerk-instant-search-suggestion {
    padding: 0.1em;
}

/* Categories */
.clerk-instant-search-categories {
    margin-bottom: 1em;
}

.clerk-instant-search-category {
    padding: 5px;
    margin: 5px;
    width: auto;
    display: inline-block;
    border: 1px solid var(--clerk-font-color);
    border-radius: 2px;
    font-weight: bold;
}

/* Pages */
.clerk-instant-search-pages {
    margin-bottom: 1em;
}

.clerk-instant-search-page {
    padding: 0.1em;
}

@media screen and (min-width: 426px) {
    .clerk-instant-search {
        min-width: 200px;
    }
    .clerk-instant-search-col {
        margin: 0px 0px 20px 0px;
    }
    .clerk-instant-search-product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (min-width: 768px) and (max-width: 1200px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
    }
    .clerk-mobile-button {
        display: none;
    }
    .clerk-instant-search-button-container {
        display: none;
    }
}
@media screen and (max-width: 767px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
    }
    .clerk-instant-search-grid {
        display: block;
    }
    .clerk-instant-search-button-container {
        display: none;
    }

    .clerk-instant-search-container {
        right: 0px;
        width: 100%;
    }
    .clerk-instant-search-grid {
        display: block;
    }
    .clerk-instant-search-button-container {
        display: none;
    }
}

@media screen and (min-width: 1200px) {
    .clerk-instant-search-container {
        width: 50%;
        right: 386px !important;
    }
    .clerk-instant-search-products {
        padding-right: 2em;
    }
    .clerk-instant-search-grid {
        display: flex;
    }

    .clerk-col-1 {
        flex: 2;
    }

    .clerk-col-2 {
        flex: 1;
    }

    .clerk-mobile-button {
        display: none;
    }
}
``` 
##### List 
```html
<div class="clerk-instant-search">
    <div class="clerk-instant-search-grid">
        {% if products.length > 0 %}
        <div class="clerk-instant-search-col clerk-col-1">
            <div class="clerk-instant-search-products">
                <div class="clerk-instant-search-title">Produkter</div>
                {% for product in products %}
                <div class="clerk-instant-search-product clerk-instant-search-key-selectable">
                    <a href="{{product.url}}" class="clerk-instant-search-link">
                        <div class="clerk-instant-search-product-image" style="background-image: url('{{ product.image }}');"></div>
                        <div class="clerk-instant-search-info-wrap">
                            <div class="clerk-instant-search-product-brand">{{product.brand}}</div>
                            <div class="clerk-instant-search-product-name">{{ product.name | highlight query }}</div>
                            {% if product.price < product.list_price %}
                            <div class="clerk-instant-search-product-price">€{{ product.price | money }}</div>
                            <div class="clerk-instant-search-product-list-price">€{{ product.list_price | money }}</div>
                            {% else %}
                            <div class="clerk-instant-search-product-price">€{{ product.price | money }}</div>
                            {% endif %}
                        </div>
                    </a>
                </div>
                {% endfor %} {% if hits > products.length %}
                <a class="clerk-view-more-results-button1" href="/module/clerk/search?search_query={{ query}}">
                    <u>
                        Se flere resultater
                    </u>
                </a>
                {% endif %}
            </div>
        </div>
        {% endif %} {% if (suggestions.length + categories.length) > 0 %}
        <div class="clerk-instant-search-col clerk-col-2">
            <div class="clerk-instant-search-suggestions">
                {% if suggestions.length > 1 %}
                <div class="clerk_instant_search_suggestions_wrap">
                    <div class="clerk-instant-search-title">Forslag</div>
                    {% for suggestion in suggestions %} {% if suggestion != query %}
                    <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                        <a class="clerk_instant_search_link" href="/module/clerk/search?search_query={{suggestion}}">{{ suggestion | highlight query }}</a>
                    </div>
                    {% endif %} {% endfor %}
                </div>
                {% endif %}
            </div>
            {% if categories.length > 0 %}
            <div class="clerk-instant-search-categories">
                <div class="clerk-instant-search-title">Kategorier</div>
                {% for category in categories %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{category.url}}">{{ category.name | highlight query }}</a>
                </div>
                {% endfor %}
            </div>
            {% endif %} {% if pages.length > 0 %}
            <div class="clerk-instant-search-pages">
                <div class="clerk-instant-search-title">Sider</div>
                {% for page in pages %}
                <div class="clerk-instant-search-category clerk-instant-search-key-selectable">
                    <a href="{{ page.url }}">
                        <div class="name">{{ page.title | highlight query 'bold' true }}</div>
                    </a>
                </div>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endif %}
    </div>
</div>

<script>
    jQuery("#searchbox").each(function () {
        jQuery(this).submit(function (e) {
            e.preventDefault();
            window.location.replace(window.location.origin + "/da/module/clerk/search?search_query={{ query }}");
        });
    });

    // This script ensures that the Instant Search is always placed right under the input field when scrolling and resizing the viewport.
    // If you do not use a sticky header, then this is not necessary.
    // You should also remove .clerk-instant-search-visible { position: fixed !important; } from the the CSS below if this is your use-case.

    if (!clerkFloatingSearchPos) {
        var clerkFloatingSearchPos = true;
        sel = document.querySelector("#{{content.id}}").dataset.instantSearch;
        xVal = document.querySelector(sel).getBoundingClientRect().bottom;
        document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        document.querySelector("#{{content.id}}").style.position = `fixed`;
        window.addEventListener("resize", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
        });
        window.addEventListener("scroll", function () {
            xVal = document.querySelector(sel).getBoundingClientRect().bottom;
            document.querySelector("#{{content.id}}").style.top = `${xVal}px`;
            document.querySelector("#{{content.id}}").style.position = `fixed`;
        });
    }
</script>
```
##### CSS
```css
.clerk-instant-search a:hover {
    color: black;
}

.clerk-instant-search {
    padding: 20px;
}

.clerk-instant-search-container a {
    text-decoration: none !important;
}

.clerk-instant-search {
    overflow-y: scroll;
    height: auto;
    width: 100%;
    margin: 0.2em auto;
    background-color: white;
    border: 1px solid #eee;
    border-top: 0px;
    border-radius: 5px 5px 10px 10px;
    box-shadow: 0 1em 2em 1em rgba(0, 0, 0, 0.2);
}

.clerk-instant-search-no-results {
    padding: 1em;
    font-style: italic;
    text-align: center;
}

.clerk-instant-search-alternate-query {
    margin: 0px 0px 5px 0px;
}

.clerk-view-more-results-button {
    color: #fff;
    width: 100%;
    display: block;
    padding: 1em;
    background-color: #5461ed;
    border: 1px solid #5461ed;
    font-size: 14px;
    border-radius: 8px;
    text-align: center;
    text-transform: uppercase;
}

.clerk-view-more-results-button:hover {
    text-decoration: none !important;
    color: #fff !important;
}

.clerk-instant-search-title {
    color: black;
    margin: 5px 0px 5px 0px;
    padding: 0px 0px 10px 0px;
    text-transform: uppercase;
    font-size: 1em;
    font-weight: bold;
    border-bottom: 1px dotted #000000;
    font-family: "Roboto", sans-serif;
}

/* Products */

.clerk-instant-search-product {
    display: flex;
    padding: 0.2em;
    margin: 0px 0px 5px 0px;
    color: #242424;
}

.clerk-instant-search-product:hover .clerk-instant-search-product-name {
    color: black;
}

.clerk-instant-search-product:hover .clerk-instant-search-product-button {
    transform: scale(1.05);
}

.clerk-instant-search-link {
    display: flex;
    flex: 1 1 auto;
}

.clerk-instant-search-link > * {
    flex: 1 1 auto;
}
.clerk-instant-search-link > *:first-child {
    flex: 0 0 auto;
}

.clerk-instant-search-product-image {
    display: inline-block;
    width: 3em;
    height: 3em;
    margin-right: 1em;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
}

.clerk-instant-search-product-name {
    max-height: 3.5em;
    margin: 0em 0em 0.2em 0em;
    padding: 0px 5px 0px 0px;
    overflow: hidden;
    font-weight: 700;
    font-family: "Roboto", sans-serif;
    color: #222222;
}

.clerk-instant-search-product-brand {
    font-size: 0.8em;
    color: #964a44;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
}

.clerk-instant-search-product-list-price {
    display: inline-block;
    margin-right: 0.5em;
    opacity: 0.8;
    font-weight: 700;
    text-decoration: line-through;
    color: #c9c9c9;
    font-family: "Oswald", sans-serif;
}

.clerk-instant-search-product-price {
    display: inline-block;
    font-weight: 700;
    font-family: "Oswald", sans-serif;
    color: #222222;
}

.clerk-instant-search-product-button {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    background-color: #b6c254;
    color: white;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

.clerk-instant-search-product-button-not-in-stock {
    flex: 0 0 auto;
    margin: 0.2em auto;
    padding: 0.8em 2em;
    border: none;
    border-radius: 0.5em;
    color: black;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    font-weight: bold;
    font-size: 0.8em;
    cursor: pointer;
}

/* Suggestions */

.clerk-icon {
    color: lightgray;
    margin-right: 0.5em;
}

.clerk-instant-search-suggestions {
    margin-bottom: 1em;
}

.clerk-instant-search-suggestion {
    padding: 0.1em;
}

/* Categories */
.clerk-instant-search-categories {
    margin-bottom: 1em;
}

.clerk-instant-search-category {
    padding: 5px;
    margin: 5px;
    width: auto;
    display: inline-block;
    border: 1px solid #617948;
    border-radius: 2px;
    font-weight: bold;
}

.clerk-instant-search-category a {
    color: black;
}

/* Pages */
.clerk-instant-search-pages {
    margin-bottom: 1em;
}

.clerk-instant-search-page {
    padding: 0.1em;
}


@media screen and (min-width: 1200px) {
    .clerk-mobile-button {
        display: none;
    }
    .clerk-instant-search-container {
        width: 50%;
        right: 386px;
    }
    .clerk-instant-search-products {
        padding-right: 2em;
    }
    .clerk-instant-search-grid {
        display: flex;
    }

    .clerk-col-1 {
        flex: 2;
    }

    .clerk-col-2 {
        flex: 1;
    }

    .clerk-mobile-button {
        display: none;
    }
}

@media screen and (min-width: 768px) and (max-width: 1200px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
    }
    .clerk-mobile-button {
        display: none;
    }
    .clerk-instant-search-button-container {
        display: none;
    }
}

@media screen and (max-width: 767px) {
    .clerk-instant-search-container {
        right: 0px !important;
        width: 100%;
        min-width: 200px !important;
    }
    .clerk-instant-search-grid {
        display: block;
    }
    .clerk-instant-search-button-container {
        display: none;
    }
    .clerk-instant-search {
        min-width: 0px;
        width: 100%;
    }
}

@media screen and (max-width: 375px) {
    .clerk-instant-search {
        min-width: 200px;;
        width: 100%;
        height: 80vh;
    }
    .clerk-instant-search-col {
        margin: 0px 0px 20px 0px;
    }
    .clerk-instant-search-product-name {
        height: 3.5em;
    }
}
```
### Search page
##### HTML
```html
<div data-name="container1" class="clerk-search-result-wrapper">
    {% if query.length > 0 %}
    <h1 id="nj0N4lrx" class="clerk-search-result-title">{{ hits }} results for "{{query}}"</h1>
    {% endif %}
    <div class="clerk-grid-wrapper">
        {% for item in products %} {% assign currency_symbol = "€" %}
        <div class="clerk-content">
            <!-- ADD CONTENT HERE -->
        </div>
        {% endfor %}
    </div>
    {% if count > products.length %}
    <div data-group="group1" class="clerk-see-more-button-wrapper" data-container="true">
        <button class="clerk-see-more-button" onclick="Clerk('content', '#{{ content.id }}', 'more', 20);">See more results</button>
    </div>
    {% endif %}
</div>

```
##### CSS
```css
.clerk-search-result-wrapper {
    padding: 0px 0px 0px 0px;
    background-color: #ffffff00;
    border-radius: 0px;
    position: relative;
    overflow: hidden;
    width: 100%;
}

.clerk-product-wrapper:hover {
    text-decoration: none;
    color: #442913;
}

.clerk-product-image {
    height: 240px;
    width: 240px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}

.clerk-product-information {
    justify-content: center;
    flex-direction: column;
    display: flex;
    align-items: center;
    text-align: center;
    gap: 10px;
}

.clerk-product-information-name:hover {
    text-decoration: underline;
}

.clerk-see-more-button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.clerk-see-more-button {
    background: #000;
    color: #fff;
    cursor: pointer;
    padding: 15px;
}

.clerk-see-more-button:hover {
    background: #000;
    color: #fff;
}

.clerk-grid-wrapper {
    width: 100%;
    display: grid !important;
    column-gap: 24px;
    row-gap: 24px;
    position: relative;
    text-decoration: none;
    color: #000;
    justify-content: center;
}

.clerk-grid-wrapper {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media screen and (max-width: 896px) {
    .clerk-grid-wrapper {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media screen and (max-width: 448px) {
    .clerk-grid-wrapper {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}
```
