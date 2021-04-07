import { computed } from 'vue';
import OutboundLink from './icons/OutboundLink.vue';
import { endingSlashRE, isExternal } from '../utils';
import { usePageData, useSiteData } from 'vitepress';
function createEditLink(repo, docsRepo, docsDir, docsBranch, path) {
    const bitbucket = /bitbucket.org/;
    if (bitbucket.test(repo)) {
        const base = isExternal(docsRepo) ? docsRepo : repo;
        return (base.replace(endingSlashRE, '') +
            `/src` +
            `/${docsBranch}/` +
            (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
            path +
            `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`);
    }
    const base = isExternal(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`;
    return (base.replace(endingSlashRE, '') +
        `/edit` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path);
}
export default {
    components: {
        OutboundLink
    },
    setup() {
        const pageData = usePageData();
        const siteData = useSiteData();
        const editLink = computed(() => {
            const showEditLink = pageData.value.frontmatter.editLink == null
                ? siteData.value.themeConfig.editLinks
                : pageData.value.frontmatter.editLink;
            const { repo, docsDir = '', docsBranch = 'master', docsRepo = repo } = siteData.value.themeConfig;
            const { relativePath } = pageData.value;
            if (showEditLink && relativePath && repo) {
                return createEditLink(repo, docsRepo || repo, docsDir, docsBranch, relativePath);
            }
            return null;
        });
        const editLinkText = computed(() => siteData.value.themeConfig.editLinkText || 'Edit this page');
        return {
            editLink,
            editLinkText
        };
    }
};
