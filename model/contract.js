/**
 * MODEL <- ADVERTISING CONTRACTS
 */

/** Trafficking Instructions/Notes
***
*** This workbook contains code required for implementing tracking ads.
*** The code may not be valid HTML and should be implemented as specified by your ad server.
*** Please see https://support.google.com/dcm/partner/answer/2837435 to learn more.
***
*** To ensure proper cache-busting, replace ' + TIMESTAMP with a dynamically generated random number.
*** Learn more at https://support.google.com/dcm/partner/answer/2837435.
***
*** Be sure to click inside the cell and select the text you want to copy, when transferring tags from a spreadsheet.
*** If you don't, and select the cell to copy, applications may put extra quotation marks ("") around the tag.
*** Which will then cause the tag to function incorrectly when placed on the publisher's webpage.
***
*** The publisher needs to insert device IDs into dc_rdid to enable in-app conversion tracking.
*** Learn more at https://support.google.com/dcm/partner/answer/2826636#mobile.
***
*** The publisher can designate its playback method for each ad by using the dc_vpm parameter.
*** Learn more at https://support.google.com/dcm/answer/2826636#10.
**/

// CONTRACT
let CONTRACT = {
    ADVERTISER_ID /*-----*/: null,
    ADVERTISER_NAME /*---*/: null,
    SITE_ID /*-----------*/: null,
    SITE_NAME /*---------*/: null,

    CAMPAIGN_ID /*-------*/: null,
    CAMPAIGN_NAME /*-----*/: null,
    CAMPAIGN_START /*----*/: null,
    CAMPAIGN_END /*------*/: null,

    AD_ID /*-------------*/: null,
    AD_NAME /*-----------*/: null,
    AD_PROPERTY /*-------*/: null,

    PLACEMENT_ID /*------*/: null,
    PLACEMENT_ID_EXT /*--*/: null,
    PLACEMENT_NAME /*----*/: null,
    PLACEMENT_COMPATIBILITY: null,

    CREATIVE_ID /*--------*/: null,
    CREATIVE_NAME /*------*/: null,
    CREATIVE_DMX /*-------*/: null,
    CREATIVE_TAG_LEGEND /**/: null,
}
module.exports = function(data) {
    let TIMESTAMP = '%%CACHEBUSTER%%';
    if(typeof CONTRACT != 'undefined' && data){
        CONTRACT  = require('deep-extend')({}, CONTRACT, data);
    }
    return {
        CONTRACT : {
            __ADVERTISER__ : {
                __ADVERTISER_ID__/*------*/: CONTRACT.ADVERTISER_ID,
                __ADVERTISER_NAME__/*----*/: CONTRACT.ADVERTISER_NAME,
            },
            DATA : {
                __SITE__ : {
                    __SITE_ID__/*--------*/: CONTRACT.SITE_ID,
                    __SITE_NAME__/*------*/: CONTRACT.SITE_NAME,
                },
                __CAMP__ : {
                    __CAMP_ID__/*--------*/: CONTRACT.CAMPAIGN_ID,
                    __CAMP_NAME__/*------*/: CONTRACT.CAMPAIGN_NAME,
                    __CAMP_START__/*-----*/: CONTRACT.CAMPAIGN_START,
                    __CAMP_END__/*-------*/: CONTRACT.CAMPAIGN_END,
                },
                __AD__ : {
                    __AD_ID__/*----------*/: CONTRACT.AD_ID,
                    __AD_NAME__/*--------*/: CONTRACT.AD_NAME,
                    __AD_PROPERTY__/*----*/: CONTRACT.AD_PROPERTY,
                },
                __PLACE__ : {
                    __PLACE_ID__/*-------*/: CONTRACT.PLACEMENT_ID,
                    __PLACE_ID_EXT__/*---*/: CONTRACT.PLACEMENT_ID_EXT,
                    __PLACE_NAME__/*-----*/: CONTRACT.PLACEMENT_NAME,
                    __PLACE_COMPATABILITY__: CONTRACT.PLACEMENT_COMPATIBILITY,
                },
                __CREATIVE__ : {
                    __CREATIVE_ID__/*----*/: CONTRACT.CREATIVE_ID,
                    __CREATIVE_NAME__/*--*/: CONTRACT.CREATIVE_NAME,
                    __CREATIVE_DMX__/*---*/: CONTRACT.CREATIVE_DMX,
                    __CREATIVE_TAG_LEGEND__: CONTRACT.CREATIVE_TAG_LEGEND,
                    __CREATIVE_TAG__/*---*/: {
                        __STANDARD__ :
                            '<A HREF="https://ad.doubleclick.net/ddm/jump/' +
                                'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                                'sz=1x1;' +
                                'ord=' + TIMESTAMP +
                            '?">' +
                                '<IMG ALT="Advertisement" BORDER="0" HEIGHT="1" WIDTH="1" SRC="' +
                                    'https://ad.doubleclick.net/ddm/jump/' +
                                    'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                                    'dc_trk_aid=' + CONTRACT.AD_ID + ';' +
                                    'dc_trk_cid=' + CONTRACT.CREATIVE_ID + ';' +
                                    'ord=' + TIMESTAMP +
                                    'dc_lat=;' +
                                    'dc_rdid=;' +
                                    'tag_for_child_directed_treatment=;' +
                                    'tfua=;' +
                                '?"/>' +
                            '<A />'
                        ,
                        __IMAGE__ :
                            '<IMG ALT="Advertisement" BORDER="0" HEIGHT="1" WIDTH="1" SRC="' +
                                'https://ad.doubleclick.net/ddm/jump/' +
                                'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                                'dc_trk_aid=' + CONTRACT.AD_ID + ';' +
                                'dc_trk_cid=' + CONTRACT.CREATIVE_ID + ';' +
                                'ord=' + TIMESTAMP +
                                'dc_lat=;' +
                                'dc_rdid=;' +
                                'tag_for_child_directed_treatment=;' +
                                'tfua=;' +
                            '?" />'
                        ,
                        __IFRAME__ :
                            '<IFRAME WIDTH="1" HEIGHT="1" MARGINWIDTH="0" MARGINHEIGHT="0" HSPACE="0" VSPACE="0" FRAMEBORDER="0" SCROLLING="no" BORDERCOLOR="#000000" SRC="' +
                                'https://ad.doubleclick.net/ddm/trackimpi/' +
                                'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                                'dc_trk_aid=' + CONTRACT.AD_ID + ';' +
                                'dc_trk_cid=' + CONTRACT.CREATIVE_ID + ';' +
                                'ord=' + TIMESTAMP +
                                'dc_lat=;' +
                                'dc_rdid=;' +
                                'tag_for_child_directed_treatment=;' +
                                'tfua=;' +
                            '?"></IFRAME>'
                        ,
                        __DCMAD__ :
                            '<INS CLASS="dcmads" STYLE="display:inline-block; width:1px; height:1px"' +
                                'data-dcm-app-id=""' +
                                'data-dcm-resettable-device-id=""' +
                                'data-dcm-rendering-mode="iframe"' +
                                'data-dcm-placement="' + 'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + '"' +
                                'data-dcm-https-only' +
                            '><SCRIPT src="https://www.googletagservices.com/dcm/dcmads.js"></SCRIPT>' +
                            '</INS>'
                        ,
                        __REDIRECT_IMAGE__ : // (USE THIS TAG IN Ad Manager ONLY):
                            'https://ad.doubleclick.net/ddm/ad/' +
                            'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                            'sz=1x1'
                        ,
                        __REDIRECT_CLICK__ : // (USE THIS TAG IN Ad Manager ONLY):
                            'https://ad.doubleclick.net/ddm/jump/' +
                            'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                            'sz=1x1'
                        ,
                        __SCRIPT__ :
                            '<SCRIPT language="JavaScript1.1" SRC="' +
                                'https://ad.doubleclick.net/ddm/trackimpj/' +
                                'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                                'dc_trk_aid=' + CONTRACT.AD_ID + ';' +
                                'dc_trk_cid=' + CONTRACT.CREATIVE_ID + ';' +
                                'ord=' + TIMESTAMP +
                                'dc_lat=;' +
                                'dc_rdid=;' +
                                'tag_for_child_directed_treatment=;' +
                                'tfua=;' +
                            '?"></SCRIPT>'
                        ,
                        __CLICK__ :
                            'https://ad.doubleclick.net/ddm/trackclk/' +
                            'N' + CONTRACT.AD_PROPERTY + '/B' + CONTRACT.CAMPAIGN_ID + '.' + CONTRACT.PLACEMENT_ID + ';' +
                            'dc_trk_aid=' + CONTRACT.AD_ID + ';' +
                            'dc_trk_cid=' + CONTRACT.CREATIVE_ID + ';' +
                            'dc_lat=;' +
                            'dc_rdid=;' +
                            'tag_for_child_directed_treatment=;' +
                            'tfua=;'
                        ,
                        __MOAT__ :
                            '<SCRIPT TYPE="text/javascript" SRC="' +
                            'https://z.moatads.com/omdusmcdonaldsdcm995855327925/moatad.js' +
                            '&moatClientSlicer1=' + CONTRACT.ADVERTISER_ID +
                            '&moatClientLevel1='  + CONTRACT.CAMPAIGN_ID +
                            '#moatClientLevel2='  + CONTRACT.SITE_ID +
                            '&moatClientLevel3='  + CONTRACT.PLACEMENT_ID +
                            '&moatClientLevel4=1x1_Site_Served' +
                            '&zMoatSSTG=1' +
                            '"></SCRIPT>'
                        ,
                    }
                }
            }
        }
    }
}
