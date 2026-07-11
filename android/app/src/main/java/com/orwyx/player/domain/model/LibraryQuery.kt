package com.orwyx.player.domain.model

/** Sort key for library listings. */
enum class SortBy(val label: String) {
    NAME("Name"),
    DATE_ADDED("Date added"),
    LAST_PLAYED("Last played"),
    SIZE("File size"),
    DURATION("Duration"),
    RESOLUTION("Resolution"),
    QUALITY("Quality"), // resolution class, then bitrate
    FRAME_RATE("Frame rate"),
}

enum class SortDirection { ASCENDING, DESCENDING }

/** Mutually-exclusive quick filters for the library. */
enum class VideoFilter(val label: String) {
    ALL("All"),
    UHD_4K("4K"),
    FHD_1080P("1080p"),
    HD_720P("720p"),
    HDR("HDR"),
    SDR("SDR"),
    FAVORITES("Favorites"),
    RECENTLY_ADDED("Recently added"),
    RECENTLY_PLAYED("Recently played"),
}

/**
 * Complete description of a library listing. The repository translates this into an
 * indexed SQL query, so sorting/filtering scales to very large libraries.
 */
data class LibraryQuery(
    val search: String = "",
    val folderPath: String? = null,
    val filter: VideoFilter = VideoFilter.ALL,
    val sortBy: SortBy = SortBy.DATE_ADDED,
    val direction: SortDirection = SortDirection.DESCENDING,
    val includePrivate: Boolean = false,
)
