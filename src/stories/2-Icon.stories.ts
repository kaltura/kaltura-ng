import { moduleMetadata, storiesOf } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@kaltura-ng/kaltura-ui';

storiesOf('Icons', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        TooltipModule,
      ],
    })
  )
  .add('Icons pack', () => ({
    template: `
        <div class="icons-list">
          <i class="kIconUpload" kTooltip="kIconUpload"></i>
          <i class="kIconkaltura_logo" kTooltip="kIconkaltura_logo"></i>
          <i class="kIconquiz" kTooltip="kIconquiz"></i>
          <i class="kIconyoutube" kTooltip="kIconyoutube"></i>
          <i class="kIconbulk" kTooltip="kIconbulk"></i>
          <i class="kIconUsers" kTooltip="kIconUsers"></i>
          <i class="kIconlive" kTooltip="kIconlive"></i>
          <i class="kIconImport" kTooltip="kIconImport"></i>
          <i class="kIconmetadata" kTooltip="kIconmetadata"></i>
          <i class="kIconview" kTooltip="kIconview"></i>
          <i class="kIconstatistic" kTooltip="kIconstatistic"></i>
          <i class="kIconplayback-file" kTooltip="kIconplayback-file"></i>
          <i class="kIconEdit" kTooltip="kIconEdit"></i>
          <i class="kIconShare" kTooltip="kIconShare"></i>
          <i class="kIconlife_donut" kTooltip="kIconlife_donut"></i>
          <i class="kIcontag" kTooltip="kIcontag"></i>
          <i class="kIconduplicate" kTooltip="kIconduplicate"></i>
          <i class="kIconlink" kTooltip="kIconlink"></i>
          <i class="kIconunlink" kTooltip="kIconunlink"></i>
          <i class="kIconremove" kTooltip="kIconremove"></i>
          <i class="kIconmore" kTooltip="kIconmore"></i>
          <i class="kIconPin" kTooltip="kIconPin"></i>
          <i class="kIconcheck-medium" kTooltip="kIconcheck-medium"></i>
          <i class="kIconautocomplete" kTooltip="kIconautocomplete"></i>
          <i class="kIconhouse" kTooltip="kIconhouse"></i>
          <i class="kIconconfirmation" kTooltip="kIconconfirmation"></i>
          <i class="kIconwarning" kTooltip="kIconwarning"></i>
          <i class="kIconarrow_up" kTooltip="kIconarrow_up"></i>
          <i class="kIcongear" kTooltip="kIcongear"></i>
          <i class="kIconreorder" kTooltip="kIconreorder"></i>
          <i class="kIconexternal_link" kTooltip="kIconexternal_link"></i>
          <i class="kIconfilter" kTooltip="kIconfilter"></i>
          <i class="kIconarrow_backward" kTooltip="kIconarrow_backward"></i>
          <i class="kIconarrow_forward" kTooltip="kIconarrow_forward"></i>
          <i class="kIconmagnifier" kTooltip="kIconmagnifier"></i>
          <i class="kIconplus" kTooltip="kIconplus"></i>
          <i class="kIconcalendar" kTooltip="kIconcalendar"></i>
          <i class="kIconCopy-to-clipboard" kTooltip="kIconCopy-to-clipboard"></i>
          <i class="kIconupload" kTooltip="kIconupload"></i>
          <i class="kIcontrash" kTooltip="kIcontrash"></i>
          <i class="kIconReport" kTooltip="kIconReport"></i>
          <i class="kIconUnknown" kTooltip="kIconUnknown"></i>
          <i class="kIconLive" kTooltip="kIconLive"></i>
          <i class="kIconfolder_large" kTooltip="kIconfolder_large"></i>
          <i class="kIconsound" kTooltip="kIconsound"></i>
          <i class="kIconhelp" kTooltip="kIconhelp"></i>
          <i class="kIconimage" kTooltip="kIconimage"></i>
          <i class="kIconplay" kTooltip="kIconplay"></i>
          <i class="kIconrefresh" kTooltip="kIconrefresh"></i>
          <i class="kIconuser" kTooltip="kIconuser"></i>
          <i class="kIconvideo" kTooltip="kIconvideo"></i>
          <i class="kIconfeed" kTooltip="kIconfeed"></i>
          <i class="kIconfolder" kTooltip="kIconfolder"></i>
          <i class="kIconPlaylist_Manual" kTooltip="kIconPlaylist_Manual"></i>
          <i class="kIconPlaylist_RuleBased" kTooltip="kIconPlaylist_RuleBased"></i>
          <i class="kIconmegaphone" kTooltip="kIconmegaphone"></i>
          <i class="kIcontarget" kTooltip="kIcontarget"></i>
          <i class="kIconConfiguration" kTooltip="kIconConfiguration"></i>
          <i class="kIconshopfront" kTooltip="kIconshopfront"></i>
          <i class="kIconrole" kTooltip="kIconrole"></i>
          <i class="kIconPin1" kTooltip="kIconPin1"></i>
          <i class="kIconpersonal-collection" kTooltip="kIconpersonal-collection"></i>
          <i class="kIcondrag-handle" kTooltip="kIcondrag-handle"></i>
          <i class="kIcontargeted_offering" kTooltip="kIcontargeted_offering"></i>
          <i class="kIconsegment" kTooltip="kIconsegment"></i>
          <i class="kIconglobe" kTooltip="kIconglobe"></i>
          <i class="kIcongeo-availability" kTooltip="kIcongeo-availability"></i>
          <i class="kIcondevices" kTooltip="kIcondevices"></i>
          <i class="kIconassets" kTooltip="kIconassets"></i>
          <i class="kIconadmin-user" kTooltip="kIconadmin-user"></i>
          <i class="kIconprogram" kTooltip="kIconprogram"></i>
          <i class="kIconcustom" kTooltip="kIconcustom"></i>
          <i class="kIconclose" kTooltip="kIconclose"></i>
          <i class="kIconclock" kTooltip="kIconclock"></i>
          <i class="kIconalphabet" kTooltip="kIconalphabet"></i>
          <i class="kIconrating" kTooltip="kIconrating"></i>
          <i class="kIconrelevance" kTooltip="kIconrelevance"></i>
          <i class="kIconrestore" kTooltip="kIconrestore"></i>
          <i class="kIconblock" kTooltip="kIconblock"></i>
          <i class="kIconlinear-channel" kTooltip="kIconlinear-channel"></i>
          <i class="kIconprice-code" kTooltip="kIconprice-code"></i>
          <i class="kIconbox-set" kTooltip="kIconbox-set"></i>
          <i class="kIcondiscount" kTooltip="kIcondiscount"></i>
          <i class="kIconsegmentation" kTooltip="kIconsegmentation"></i>
          <i class="kIconppv" kTooltip="kIconppv"></i>
          <i class="kIconsmiley" kTooltip="kIconsmiley"></i>
          <i class="kIconsubscription" kTooltip="kIconsubscription"></i>
          <i class="kIconengagement" kTooltip="kIconengagement"></i>
          <i class="kIcondynamic-collection" kTooltip="kIcondynamic-collection"></i>
          <i class="kIconadd-to-collection" kTooltip="kIconadd-to-collection"></i>
          <i class="kIconzoom" kTooltip="kIconzoom"></i>
          <i class="kIconList" kTooltip="kIconList"></i>
          <i class="kIcondatabase_search" kTooltip="kIcondatabase_search"></i>
          <i class="kIconcollection" kTooltip="kIconcollection"></i>
          <i class="kIconvod" kTooltip="kIconvod"></i>
          <i class="kIconepisodes" kTooltip="kIconepisodes"></i>
          <i class="kIconmovies" kTooltip="kIconmovies"></i>
          <i class="kIconseries" kTooltip="kIconseries"></i>
          <i class="kIconmetadata-templates" kTooltip="kIconmetadata-templates"></i>
          <i class="kIconcheckbox" kTooltip="kIconcheckbox"></i>
          <i class="kIcondate-and-time" kTooltip="kIcondate-and-time"></i>
          <i class="kIcondropdown" kTooltip="kIcondropdown"></i>
          <i class="kIconinput-field-numeric" kTooltip="kIconinput-field-numeric"></i>
          <i class="kIconinput-field" kTooltip="kIconinput-field"></i>
          <i class="kIconswitch" kTooltip="kIconswitch"></i>
          <i class="kIconuser_small" kTooltip="kIconuser_small"></i>
          <i class="kIconsync" kTooltip="kIconsync"></i>
          <i class="kIconInfo_Full" kTooltip="kIconInfo_Full"></i>
          <i class="kIconlive_transcoding" kTooltip="kIconlive_transcoding"></i>
          <i class="kIconfile-small" kTooltip="kIconfile-small"></i>
          <i class="kIconimage-small" kTooltip="kIconimage-small"></i>
          <i class="kIconsound-small" kTooltip="kIconsound-small"></i>
          <i class="kIconvideo-small" kTooltip="kIconvideo-small"></i>
          <i class="kIconhelp_full" kTooltip="kIconhelp_full"></i>
          <i class="kIconcheck_large" kTooltip="kIconcheck_large"></i>
          <i class="kIconpen" kTooltip="kIconpen"></i>
          <i class="kIcontree-arrow-right" kTooltip="kIcontree-arrow-right"></i>
          <i class="kIcontree-arrow-down" kTooltip="kIcontree-arrow-down"></i>
          <i class="kIcontranscoding" kTooltip="kIcontranscoding"></i>
          <i class="kIconinactive" kTooltip="kIconinactive"></i>
          <i class="kIconscheduled" kTooltip="kIconscheduled"></i>
          <i class="kIconcomplete" kTooltip="kIconcomplete"></i>
          <i class="kIconerror" kTooltip="kIconerror"></i>
          <i class="kIconupload2" kTooltip="kIconupload2"></i>
          <i class="kIconpartial_small" kTooltip="kIconpartial_small"></i>
          <i class="kIconpagination_end" kTooltip="kIconpagination_end"></i>
          <i class="kIconpagination_start" kTooltip="kIconpagination_start"></i>
          <i class="kIconcheck_small" kTooltip="kIconcheck_small"></i>
          <i class="kIconclose_small" kTooltip="kIconclose_small"></i>
          <i class="kIcondropdown_arrow_bottom" kTooltip="kIcondropdown_arrow_bottom"></i>
          <i class="kIcondropdown_arrow_right" kTooltip="kIcondropdown_arrow_right"></i>
          <i class="kIcondropdown_arrow_left" kTooltip="kIcondropdown_arrow_left"></i>
          <i class="kIcondropdown_arrow_top" kTooltip="kIcondropdown_arrow_top"></i>
          <i class="kIconsettings-upgrade-1" kTooltip="kIconsettings-upgrade-1"></i>
          <i class="kIconsettings-upgrade-2" kTooltip="kIconsettings-upgrade-2"></i>
          <i class="kIconrefresh_small" kTooltip="kIconrefresh_small"></i>
          <i class="kIconprogram-small" kTooltip="kIconprogram-small"></i>
          <i class="kIconcustom-small" kTooltip="kIconcustom-small"></i>
          <i class="kIconepisode-small" kTooltip="kIconepisode-small"></i>
          <i class="kIconmovies-small" kTooltip="kIconmovies-small"></i>
          <i class="kIconseries-small" kTooltip="kIconseries-small"></i>
        </div>
    `,
  }));
