import ServerSideRender  from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import { SelectControl, 
    Toolbar,
    Button,
    Tooltip,
    PanelBody,
    PanelRow,
    FormToggle,
    ToggleControl,
    ToolbarGroup,
    Disabled, 
    RadioControl,
    RangeControl,
    TextControl, 
    FontSizePicker } from '@wordpress/components';

    import {
        RichText,
        AlignmentToolbar,
        BlockControls,
        BlockAlignmentToolbar,
        InspectorControls,
        InnerBlocks,
        withColors,
        PanelColorSettings,
        getColorClassName
    } from '@wordpress/block-editor'
    ;
import { withSelect, widthDispatch } from '@wordpress/data';
import { withState } from '@wordpress/compose';


const orderbyOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Date', value: 'date' },
    { label: 'Menu Order', value: 'menu_order' },
    { label: 'Random', value: 'rand' },
 ];

const orderOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
];
var fetchUrlAction = ajaxurl+'/wp-admin/admin-ajax.php?action=wpcd_get_taxonomies_action';


const taxonomyList = [
    { label: 'Categories', value: 'category' }
];

wp.apiFetch({url: fetchUrlAction}).then(response => {
    jQuery.each( response, function( key, val ) {
        taxonomyList.push({label: val.label, value: val.name});
    });
});

const allTerms = {};

var taxTerms = ajaxurl+'/wp-admin/admin-ajax.php?action=wpcd_get_taxonomy_terms_action';
wp.apiFetch({url: taxTerms}).then(response => {
        jQuery.each( response, function( key, val ) {
            if (!allTerms[val.taxonomy]) {
                allTerms[val.taxonomy] = [];
            }
            allTerms[val.taxonomy].push({label: val.name, value: val.term_id});
        });    
        console.log(allTerms);
});

const getTerms = (taxonomy) => {
   if (Array.isArray(allTerms[taxonomy])) {
       return allTerms[taxonomy];
   } else {
       return [{label: "<No Categories Found>", value: null}];
   }
};

const edit = props => {
    const { attributes: {align, orderby, order, showcount, hierarchical, hide_empty, exclude, include, default_option_text, default_option_sub, category}, className, setAttributes, isSelected } = props;

    const setTaxonomy = category => {
        props.setAttributes({category, exclude: [], include: []});
    };

    const excludeCategories = exclude => {
        props.setAttributes( { exclude} );
    };

    const includeCategories = include => {
        props.setAttributes( { include} );
    };

    const inspectorControls = (
        <InspectorControls key="inspector">
            <PanelBody title={ __( 'Category Dropdown Options' )}>
                <PanelRow>
                    <SelectControl
                        label="Order By"
                        value={orderby}
                        options= { orderbyOptions }
                        onChange={ ( nextValue ) =>
                            setAttributes( {orderby: nextValue } )
                        }
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label="Order"
                        value={order}
                        options= { orderOptions }
                        onChange={ ( nextValue ) =>
                            setAttributes( {order: nextValue } )
                        }
                    />
                </PanelRow>
                <PanelRow>
                    <ToggleControl
						label={ __( 'Show the number of posts in each Category' ) }
						checked={ showcount }
                        onChange={ ( nextValue ) =>
                            setAttributes( { showcount:nextValue } )
                        }
                        help={showcount ? __('Show the number of posts in each category for both parent and child categories', GCSCD_TXT_DOMAIN) : __('', GCSCD_TXT_DOMAIN) }
					/>
                </PanelRow>
                <PanelRow>
                    <ToggleControl
						label={ __( 'Show the categories in a hierarchy' ) }
						checked={ hierarchical }
                        onChange={ ( nextValue ) =>
                            setAttributes( { hierarchical:nextValue } )
                        }
                        help={ hierarchical ? __('Shows only the parent categories in the first dropdown', GCSCD_TXT_DOMAIN) : __('Shows all the categories in the first dropdown', GCSCD_TXT_DOMAIN) }
					/>
                </PanelRow>
                <PanelRow>
                    <ToggleControl
						label={ __( 'Hide the emtpy categories' ) }
						checked={ hide_empty }
                        onChange={ ( nextValue ) =>
                            setAttributes( { hide_empty:nextValue } )
                        }
                        help={hide_empty ? __('Hides the categories without any posts in parent and child category dropdowns', GCSCD_TXT_DOMAIN) : __('All categories are shown in the dropdowns', GCSCD_TXT_DOMAIN) }
					/>
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        label="Categories"
                        value={ category }
                        options={ taxonomyList }
                        onChange={ setTaxonomy }
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl
                        multiple
                        label="Exclude Categories"
                        value={ exclude }
                        options={ getTerms(category) }
                        onChange={ excludeCategories }
                    />
                </PanelRow>
                <PanelRow>
                    <SelectControl 
                        multiple
                        label = "Include Categories"
                        value = {include}
                        options = { getTerms(category) }
                        onChange = {includeCategories}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label="Parent Category Text"
                        value={ default_option_text }
                        onChange={ ( nextValue ) =>
                            setAttributes( { default_option_text: nextValue } )
                        }
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label="Child Category Text"
                        value={ default_option_sub }
                        onChange={ ( nextValue ) =>
                            setAttributes( { default_option_sub: nextValue } )
                        }
                    />
                </PanelRow>
            </PanelBody>
        </InspectorControls>
    );

    return [
        <div className={ props.className }>
            <ServerSideRender
                block="gcs/wp-category-dropdown"
                attributes = {props.attributes}
            />
            { inspectorControls }
        </div>
    ];
};

export default edit;